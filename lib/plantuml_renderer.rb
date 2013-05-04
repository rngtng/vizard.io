# encoding: utf-8

require File.join(File.dirname(__FILE__), 'plantuml.jar')

java_import 'net.sourceforge.plantuml.SourceStringReader'
java_import 'net.sourceforge.plantuml.FileFormatOption'
java_import 'net.sourceforge.plantuml.FileFormat'
java_import 'java.io.ByteArrayOutputStream'
java_import 'java.io.FileOutputStream'

module PlantumlRenderer
  extend self

  FORMAT_MAPPING = {
    'svg'  => FileFormat::SVG,
    'png'  => FileFormat::PNG,
    'txt'  => FileFormat::ATXT,
    'utxt' => FileFormat::UTXT
    # error: PDF, HTML
    # wrong: HTML5
    # untested: EPS, EPS_TEXT, XMI_STANDARD, XMI_STAR, XMI_ARGO, MJPEG
  }

  def decorate(string)
    return string if string =~ /@startuml/
    "@startuml\n #{string}\n @enduml"
  end

  def render(diagram_data, format = 'svg')
    diagram_data = decorate(diagram_data)
    ByteArrayOutputStream.new.tap do |out|
      SourceStringReader.new(diagram_data).generate_image(out, FileFormatOption.new(FORMAT_MAPPING[format.to_s]))
      return out.to_byte_array.to_a.pack('c*')
    end
  end

  def render_to_file(filename, diagram_data, format = 'png')
    File.open(filename, "w") do |f|
      f.puts render(diagram_data, format)
    end
  end
end


__END__
string = 'Bob -> Alice : hello'

puts Plantuml.render(string, :png)


java_import 'java.io.ImageIO'
java_import 'java.io.BufferedImage'
java_import 'java.io.File'

out = FileOutputStream.new("test.png")
output_stream =
out.writeTo(output_stream)
out.close


repo = Github::Repos.new({:user => 'soundcloud', :repo => 'payments-team'})
repos.branches do |branch|
  puts branch.name
end


# def github
#   @github ||= github.git_data.trees.get 'rngtng', 'massive_sitemap', 'HEAD' do |file|
#     file.path
#   end


# Encoding.default_internal = Encoding::UTF_8
# Encoding.default_external = Encoding::UTF_8
