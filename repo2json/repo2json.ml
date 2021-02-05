(*
 * before running this program...
 *   1. Clone 'satyrographos-repo' in current directory.
 *   2. Install 'satyrographos-snapshot-stable' via opam.
 *   3. Run 'satyrographos install'.
 *   4. Copy '.satysfi/dist/docs' in current directory.
 *)

let package_root = "./satyrographos-repo/packages"
let doc_root = "./docs"
let font_root = "./fonts"

type package_type =
  Library | Class | Font | Document | Satysfi | Satyrographos | Snapshot | Other

type per_version_info = {
  version         : string;
  synopsis        : string;
  description     : string;
  maintainer      : string list;
  authors         : string list;
  license         : string list;
  homepage        : string list;
  bug_reports     : string list;
  dependencies    : (string * string) list;
  published_on    : string;
  documents       : string list;
  fonts           : string list;
  tags            : string list;
}

type package_info = {
  name            : string;
  pkg_type        : package_type;
  last_update     : string;
  versions        : per_version_info list;
}

type snapshot_info = {
  name            : string;
  published_on    : string;
  packages        : (string * string) list;
}

let string_of_package_type t =
  match t with
  | Library       -> "Library"
  | Class         -> "Class"
  | Font          -> "Font"
  | Document      -> "Document"
  | Satysfi       -> "Satysfi"
  | Satyrographos -> "Satyrographos"
  | Snapshot      -> "Snapshot"
  | Other         -> "Other"

let remove_head n str = String.sub str n ((String.length str) - n)

let get_package_path name version =
  List.fold_left Filename.concat package_root [name; name ^ "." ^ version]

let get_opamfile_path name version =
  Filename.concat (get_package_path name version) "opam"

let get_package_name_list () =
  Sys.readdir package_root |> Array.to_list

let get_package_version_list name =
  let pkgname_part_len = String.length (name ^ ".") in
  let dirs = Sys.readdir (Filename.concat package_root name) |> Array.to_list in
  List.map (remove_head pkgname_part_len) dirs |> List.sort (fun a b -> OpamVersionCompare.compare b a)

let get_package_type name =
  let open Str in
  let regexp_type_pair = [
    (regexp ".*-doc$",           Document);
    (regexp "^satysfi-class-.*", Class);
    (regexp "^satysfi-fonts-.*", Font);
    (regexp "^satysfi$",         Satysfi);
    (regexp "^satyrographos-snapshot-.*",  Snapshot);
    (regexp "^satyrographos.*",  Satyrographos);
    (regexp "^satysfi-.*",       Library)
  ] in
  let rec iter lst =
    match lst with
    | [] -> Other
    | (r, t) :: rest ->
        if string_match r name 0 then
          t
        else
          iter rest
  in
  iter regexp_type_pair

let find_variable_in_opamfile ofile name =
  let open OpamParserTypes.FullPos in
  let rec iter (ilst : opamfile_item list) =
    match ilst with
    | [] -> None
    | { pelem = Variable(nm_withpos, value_withpos); _ } :: rest ->
        if String.compare nm_withpos.pelem name == 0 then
          Some(value_withpos.pelem)
        else
          iter rest
    | _ :: rest -> iter rest
  in
  iter ofile.file_contents

let find_string_variable_in_opamfile ofile name =
  let open OpamParserTypes.FullPos in
  match find_variable_in_opamfile ofile name with
  | Some(String(str)) -> str
  | _                    -> ""

let find_string_list_variable_in_opamfile ofile name =
  let open OpamParserTypes.FullPos in
  match find_variable_in_opamfile ofile name with
  | Some(String(strval)) -> [strval]
  | Some(List(vallst))   ->
      vallst.pelem |> List.map
        (function | { pelem = String(s); _ } -> s
                  | v -> OpamPrinter.FullPos.value v)
  | _ -> []

(* TODO *)
let extract_package_name depexp =
  let open Str in
  split (regexp "\"") depexp |> List.hd

let extract_version_constraint depexp =
  let open Str in
  if string_match (regexp ".*{\\(.*\\)}$") depexp 0 then
    matched_group 1 depexp
  else
    "(any)"

let extract_version_designation depexp =
  let open Str in
  if string_match (regexp "^= \"\\(.*\\)\"$") depexp 0 then
    Some(matched_group 1 depexp)
  else
    None

let find_dep_list_variable_in_opamfile ofile name =
  let open OpamParserTypes.FullPos in
  match find_variable_in_opamfile ofile name with
  | Some(List(vallst))   ->
      vallst.pelem
      |> List.map OpamPrinter.FullPos.value
      |> List.map (fun v ->
          (extract_package_name v, extract_version_constraint v))
  | _ -> []

let strlist_to_json lst = `List (List.map (fun s -> `String s) lst)

let deplist_to_json lst =
  let dep_to_json dep =
    let (nm, c) = dep in
    `Assoc [("name", `String nm); ("constraint", `String c)]
  in
  `List (List.map dep_to_json lst)

let pkglist_to_json lst =
  let dep_to_json dep =
    let (nm, c) = dep in
    `Assoc [("name", `String nm); ("version", `String c)]
  in
  `List (List.map dep_to_json lst)

let json_of_per_version_info info =
  `Assoc [
    ("version",        `String info.version);
    ("synopsis",       `String info.synopsis);
    ("description",    `String info.description);
    ("maintainer",     strlist_to_json info.maintainer);
    ("authors",        strlist_to_json info.authors);
    ("license",        strlist_to_json info.license);
    ("homepage",       strlist_to_json info.homepage);
    ("bug_reports",    strlist_to_json info.bug_reports);
    ("dependencies",   deplist_to_json info.dependencies);
    ("published_on",   `String info.published_on);
    ("documents",      strlist_to_json info.documents);
    ("fonts",          strlist_to_json info.fonts);
    ("tags",           strlist_to_json info.tags);
  ]

let json_of_package_info (info : package_info) =
  `Assoc [
    ("name",     `String info.name);
    ("type",     `String (string_of_package_type info.pkg_type));
    ("last_update",`String info.last_update);
    ("versions", `List (List.map json_of_per_version_info info.versions));
  ]

let json_of_package_info_list lst =
  `List (List.map json_of_package_info lst)

let json_of_snapshot_info info =
  `Assoc [
    ("name",           `String info.name);
    ("published_on",   `String info.published_on);
    ("packages",   pkglist_to_json info.packages);
  ]

let json_of_snapshot_info_list lst =
  `List (List.map json_of_snapshot_info lst)

let dir_contents dir =
  let rec loop result = function
    | f::fs when Core.Sys.is_directory f ~follow_symlinks:false == `Yes ->
          Sys.readdir f
          |> Array.to_list
          |> List.map (Filename.concat f)
          |> List.append fs
          |> loop result
    | f::fs -> loop (f::result) fs
    | []    -> result
  in
    loop [] [dir]

let get_document_package_name name = name ^ "-doc"

let get_docfile_list name =
  let open Str in
  let name = get_document_package_name name in
  if string_match (regexp "^satysfi-\\(.*-doc$\\)") name 0 then
    let doc_dir_name = matched_group 1 name in
    let doc_path = doc_root ^ "/" ^ doc_dir_name in
    if Sys.file_exists doc_path && Sys.is_directory doc_path then
      dir_contents doc_path |> List.sort String.compare
    else
      []
  else
    []

let get_fontfile_list name =
  let open Str in
  if string_match (regexp "^satysfi-\\(.*\\)") name 0 then
    let font_dir_name = matched_group 1 name in
    let font_path = font_root ^ "/" ^ font_dir_name in
    if Sys.file_exists font_path && Sys.is_directory font_path then
      dir_contents font_path |> List.map Filename.basename |> List.sort String.compare
    else
      []
  else
    []

let is_package_exists pkglst name =
  try
    ignore (List.find (fun s -> (String.compare s name) == 0) pkglst);
    true
  with
    Not_found -> false

let get_package_updated_date name version =
  let package_path = get_package_path name version in
  let cmd = "git --no-pager -C " ^ package_path ^ " log --pretty=%ad -n1 --date=short opam" in
  let chan = Unix.open_process_in cmd in
  let result = input_line chan in
    ignore (Unix.close_process_in chan);
    result

let get_package_published_date name version =
  let package_path = get_package_path name version in
  let cmd = "git --no-pager -C " ^ package_path ^ " log --pretty=%cd --date=short opam" ^ " | tail -n1" in
  let chan = Unix.open_process_in cmd in
  let result = input_line chan in
    ignore (Unix.close_process_in chan);
    result

let get_per_version_info name version =
  let opamfile_path = get_opamfile_path name version in
  let ofile = OpamParser.FullPos.file opamfile_path in
  let get_str_variable = find_string_variable_in_opamfile ofile in
  let get_strlist_variable = find_string_list_variable_in_opamfile ofile in
  let get_deplist_variable = find_dep_list_variable_in_opamfile ofile in
  {
    version         = version;
    synopsis        = get_str_variable "synopsis";
    description     = get_str_variable "description";
    maintainer      = get_strlist_variable "maintainer";
    authors         = get_strlist_variable "authors";
    license         = get_strlist_variable "license";
    homepage        = get_strlist_variable "homepage";
    bug_reports     = get_strlist_variable "bug-reports";
    dependencies    = get_deplist_variable "depends";
    published_on    = get_package_published_date name version;
    documents       = get_docfile_list name;
    fonts           = get_fontfile_list name;
    tags            = get_strlist_variable "tags";
  }

let get_package_info name =
  let versions = get_package_version_list name in
  {
    name     = name;
    pkg_type = get_package_type name;
    last_update = get_package_updated_date name (List.hd versions);
    versions = List.map (get_per_version_info name) versions;
  }

let get_all_package_info () =
  get_package_name_list ()
  |> List.map get_package_info
  |> List.sort (fun (a:package_info) b -> String.compare a.name b.name)

let convert_to_snapshot_info_list pkg =
  let rec aux deps lst =
    match deps with
    | (nm, con) :: rest ->
        begin match extract_version_designation con with
        | Some(ver) -> aux rest ((nm, ver) :: lst)
        | None    -> aux rest lst
        end
    | [] -> List.rev lst
  in
  pkg.versions
  |> List.map (fun ver ->
    {
      name = pkg.name ^ "." ^ ver.version;
      published_on= get_package_published_date pkg.name ver.version;
      packages = aux ver.dependencies [];
    }
  )

let get_all_snapshot_info () =
  get_all_package_info ()
  |> List.filter (fun p -> match p.pkg_type with
                           | Snapshot -> true
                           | _ -> false)
  |> List.map convert_to_snapshot_info_list
  |> List.flatten

let output_json out_file jsondata =
  let ochan = open_out out_file in
  Yojson.Basic.pretty_to_channel ochan jsondata;
  close_out ochan

let generate_packages_data out_file =
  let package_info_list =
    get_all_package_info ()
    |> List.filter (fun p -> match p.pkg_type with
                             | Library | Class | Font | Document | Satysfi | Satyrographos -> true
                             | _ -> false)
  in
  json_of_package_info_list package_info_list |> output_json out_file

let generate_snapshots_data out_file =
  let snapshot_info_list = get_all_snapshot_info () in
  json_of_snapshot_info_list snapshot_info_list |> output_json out_file

let () =
  let out_packages_file = Sys.argv.(1) in
  let out_snapshots_file = Sys.argv.(2) in
  generate_packages_data out_packages_file;
  generate_snapshots_data out_snapshots_file
