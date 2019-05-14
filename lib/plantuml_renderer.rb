# frozen_string_literal: true

require File.join(File.dirname(__FILE__), 'plantuml.jar')

java_import 'net.sourceforge.plantuml.SourceStringReader'
java_import 'net.sourceforge.plantuml.FileFormatOption'
java_import 'net.sourceforge.plantuml.FileFormat'
java_import 'java.io.ByteArrayOutputStream'
java_import 'java.io.FileOutputStream'

module PlantumlRenderer
  module_function

  FORMAT_MAPPING = {
    'svg' => FileFormat::SVG,
    'png' => FileFormat::PNG,
    'txt' => FileFormat::ATXT,
    'utxt' => FileFormat::UTXT
    # error: PDF, HTML
    # wrong: HTML5
    # untested: EPS, EPS_TEXT, XMI_STANDARD, XMI_STAR, XMI_ARGO, MJPEG
  }.freeze

  DEFAULTS = <<~EOF
    skinparam sequenceArrowColor #3ed715
    skinparam sequenceLifeLineBorderColor #3ed715
    skinparam sequenceLifeLineBackgroundColor #FF3300

    skinparam sequenceParticipantBorderColor #CCCCCC
    skinparam sequenceParticipantBackgroundColor #CCCCCC

    skinparam sequenceActorBorderColor #CCCCCC
    skinparam sequenceActorBackgroundColor #CCCCCC

    skinparam sequenceBoxBorderColor #00AAFF
    skinparam sequenceBoxBackgroundColor #LightBlue

    skinparam noteBorderColor #F2F2F2
    skinparam noteBackgroundColor #F2F2F2
  EOF

  def decorate(string)
    return string if string =~ /@start/

    "@startuml\n #{DEFAULTS} #{string}\n @enduml"
  end

  def render(diagram_data, format = 'svg')
    diagram_data = decorate(diagram_data)
    out = ByteArrayOutputStream.new
    SourceStringReader.new(diagram_data).generate_image(out, FileFormatOption.new(FORMAT_MAPPING[format.to_s]))
    out.to_byte_array.to_a.pack('c*')
  end
end
