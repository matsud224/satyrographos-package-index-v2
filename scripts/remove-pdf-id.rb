#!/usr/bin/env ruby

require 'origami'

pdf = Origami::PDF.read(ARGV[0])

trailer = pdf.trailer
newid = 'a' * 16
trailer.ID = [newid, newid]

pdf.save(ARGV[0])
