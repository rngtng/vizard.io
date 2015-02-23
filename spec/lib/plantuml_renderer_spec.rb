# encoding: utf-8

require 'lib/plantuml_renderer'

RSpec::Matchers.define :match_bytes do |expected|
  def buyes_to_string(data)
    data.bytes.to_a.map {|byte| byte.to_s(16) }.join
  end

  match do |actual|
    buyes_to_string(actual).should == expected
  end

  failure_message_for_should do |actual|
    "expected: " + buyes_to_string(actual)
  end

  description do
    "bytes matches"
  end
end

describe PlantumlRenderer do
  describe '#decorate' do
    let(:data) { "test" }
    subject { PlantumlRenderer.decorate(data) }

    it { should == "@startuml\n test\n @enduml" }

    context "already decorated" do
      let(:data) { PlantumlRenderer.decorate("test") }

      it { should == data }
    end
  end

  describe '#render' do
    let(:data) { 'Bob -> Alice : hello' }
    let(:format) { :png }

    subject { PlantumlRenderer.render(data, format) }

    it { should match_bytes("89504e47da1aa000d494844520006e0007582000202843f40003574455874636f70796c656674047656e65726174656420627920687474703a2f2f706c616e74756d6c2e736f75726365666f7267652e6e65743a67551b000cd7a545874706c616e74756d6c00789c1d8e316bc330184477fd8a1bed41c14a64157b8498a692911d5552ba5391154204b41feecdf5f37dbc1bb77dc6e249b691a2c321f5e05bec83bf39b4f8752124869d8bf77fcc4ec146bae8236697479f225e1a55177a9fb47c6ba81685aa1da8dc06b67ce58576253b2e2ed74c498a6bc4cdefd48d9f7132d72c93eec6c8bb32e613a7c4d91fce0d0c5d9e714717e9c9f19ec83c123d7b4af283271897973f8d64cacd4aabaca9af795e2b2165c82d65a598b6377c1afcfc124041a6689eaa2f0083c4944415478daed9d7b4c544714c637a2c6542de2b50b03658c558b496a28b9ac84bc34d58a9d5124ab5a436468c49b5a26985c6481315eaa3d0aa585e2df25017171f202ea01452d0edc614151710acbc4110b01141a09f8e922d72f725bbf7ba9c93f963ee3077efb7bf3d33676633cb11f5aa587d8e3c49b4c0c8a52157deabc97811a6ab60d1cb8a4b7edc5f9f9364845212b15f27944613a69fe0150e29e9e9ebf8c50eab2937442693461fa9e61f6546c4b1828228542a1542aababab5b5b5b58e924b30ff285342c3a552a94c262b2a2a82b8c6c64681a3e412cc3fca841d6189898912894e2f051e37316384a2ec1fca38cfde131b1bb71f8a831702a2a2a48e924b30ff289343f643595c5c5c4a4aa3e67c1981a3e4124c28858db2b3f3ea9327d77847a9a5c63a39448228e1cf9f6f8f1508522a9bb5baefe912e2e1f84846c3026ca9a9a2cc8abadcde292919e7ef0dab54441a05cb0e0ddb973dff1f25a6c61f1e69429935a5bf348572e7ce2f4422d1ae5d5f72c958b3667944c456a1a0dcbefd7354aaaa32478d1a79f0e037c24189816c6d3d71e6ccb76c6d2d5547b496327843d9dc7c79cc9837ce9c39807a63638ebfff87969613acac26447c74ff7e6edf7b80836cd9f229fe3463862d26783a23c7d3a7cf2e4f18585970ccf3e77f1a1025741e3ab49dd5217bfdfa9553a74e1e3b76f4fcf9f6acb1be5ee6e3e38631676f3f5d263b6258947e7eded1d121cb9689c1e8f1e322347a7a3abbbb2fb871e3148a9b9b13867fdf7bb0b1b1cffffafaf514889e30c1bcabeb9ae1507a7b2f611fb393d39cd5abdd744a95af7f05868676773f6eca18e8ec2e2e2937d8d8181ab1e3cc88b8cdce1e030c3b028e7cd9b29163b4c9a641113f33d224f79793abc80b9278b4bb8acac3ccf7477afeb731b4e7e7c71a8259e6866364ca93c833a22cf8811c3ebea2ea9415956f65476bf799335c2bbe113884e7841c43183f7048c7b88dfdaa308fafaebec83adcbb9781cbdcdce89727298cbe37b6198251e346edcd8a0a03528ebd6ad8086bd7bb7a841c964cbe5ff8be6acd1d979eee2c5efb172e5caaf64789b269d32773e6d8ddbc791a8fcfcafa85355eb810894be61daaefa1a1211beda9a9fbc8112f366692cd9bd76254b2b27cb933263b35284b4ba5d01315b553f57558634646a4f1c2e622586c0ecd96fc35102b1d1d67632c5c28b1c8d77719a62ab6e4846e4c3d68c45bdbbc25c39e0e2e9d55162b53871e2384c797d2d2cf8309fe29a2b5d5d9d301b5ebdfa3bea25251216f431e9a3bda2e21ceaededf97a8d61a5e89921226fdce88be18cc6dbb7d380cfdc7cc623aa651e6924c37d671b3664d87cb606eedf3dc4147b962c5d2ad5b3febd788391dcb93528b19ec325decbf8f1e6583f3d7af4275be4237c61964444c2c283cd54c6de3822b0c01555b107e129f0508856b335e277fded4d45f364a5bdb1ffdb64cf47567d334428925a12494849250124a7d519644ecc73d4628ecdc88f6288d264c3fc122de4f39698f5220452b949dfda1b72e5ac64441c4b9d4fd811161fbc7371bb0c4c46b44c98f301d58bb84e3c15141448a5d2c4c4c458a398fa2353cad35e30274a85421e412894f7c419d8341e74e14b984e823951c26f8b8a8ad01bec53c6c1a8f5ff1254c27c19c2811bfd401d3e2cd3ce6236ec90e9651af5bea2b04111a95130274af406f74c55ca0d4cee8e785fa997e11178101e8787767474a847a987b04111a951b0a877f0cb855ec19be144124a4269da28ffe392a7c94861329ea2523948492509251d8792dc3e2d86825a124948492c28e3016435d5d5ddddddd7a74d6e9c621b1ae747171999d1a3b34e37124a4249287993b8cc8eeddbba74d9bb668d1a2c2c242d6ded0d0e0e3e3636161616f6f9f9d9dad1e65535393bfbfbfa5a5a59595554040407373f350dced8088b5b575505050717131d8ad5ab58ab57b7878466b6b6b6464545393838a847e9e9e9e9eeee7ef399b9b9b9797979dc5752588ac5dbb96d5a3a3a36d6d6d51292f2f1789441289468e472b99999596d6d2d17ca3b77eea0b3542a65ed696969b8bc7bf7ee5044d947272121c1c6c66158ce8673f3c725efcc2f2f2f2b850b2ce353535acbdaaaaa97972f5f26944f519695951476666a63661e7d6ad5be87ce9d225d69e91f1f4c76ba5a5a5436eb733204a18e63e5757d7caca4ad41f3e7cd8d6d6c68512b754747473f3f3ff4696969f1f5f5757272eae9e91972bb1d2e94981cbdbdbd314bdad9d92134b31cb1576944a25f0993ffbc995582c5675c97fefd5971f4b7b54db64faeb4af5d6dede5e5757a765672c89e0952fb7d75c28c0e04d1db5a436b370e8a21c2cbb7be2223b4d7a6a9c9b62dbe18ec61642a9bfd56515a68e5e9a325cfcf478ae99386be13aa339a997ec9f69ce6c845cfcf3b9b39ab3ae96bb3db1166491eb69055fe4995d1b7e83a58cdb9fce411cf5d5232d133cdd22bfded8f6ffe10cbbc9250eac6317998387dfaca93635cf2576fc778efe97a623abb1de35845fc79e68caa6e686abb1d63f8e38b75653f3734b5dd8ea1dbb9d5bfb7e7b585133d4773ba6618492509a364a3a52606a4b74be44124a424928925851d1d5176b6b4d5e7c88d5c3a1fb46b54c98b305d5f3ffbf33287511a52ed2225a52ea2d44594ba88521751ea224a5d44a98be83f5124a424959a028b146581a22c509458ab240511628ca24559a028b146581a22c509454a57949458ab240511628fa3a8350124a424928925a124949458a17619454aa859a07222e3d3c2e9ff86e6f7cf01e8396b89f8f6a3c52c08b305d553ea224a5d64daa98b63713901084f196ba6870331941984e82ff386ded4bba814a9000049454e44ae426082") }

    context "format is txt" do
      let(:format) { :txt }

      it { should == "     ,---.          ,-----.\n     |Bob|          |Alice|\n     `-+-'          `--+--'\n       |    hello      |   \n       |-------------->|   \n     ,-+-.          ,--+--.\n     |Bob|          |Alice|\n     `---'          `-----'\n" }
    end
  end
end
