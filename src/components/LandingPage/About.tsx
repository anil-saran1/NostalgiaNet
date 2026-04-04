import bg from "../../assets/aboutBg.png";
const About = () => {
  return (
    <div className="p-4">
      <div
        className="flex flex-col h-auto justify-center items-center rounded-3xl"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h1 className="text-5xl w-full font-bold text-left text-[#636363] tracking-[1.8rem] font-SpaceMono p-8 px-20">
          About Us
        </h1>
        <div className="text-[#262626] text-left w-full font-Inter px-20 py-10">
          Welcome to NostalgiaNet - your personal digital time capsule. We
          believe that every moment is worth preserving, whether it's a
          cherished family photo, a heartfelt video message, or a snapshot of a
          beautiful day. NostalgiaNet is here to help you capture these moments
          and store them safely, so you can relive them exactly as they were,
          whenever you choose. <br /><br /> Our Mission Our mission is simple: to create a
          space where memories are timeless. We understand how precious your
          moments are, and we want to ensure that they are preserved for the
          future. With NostalgiaNet, you can securely store your images and
          videos for days, months, or even years, creating a bridge between your
          past, present, and future. <br /><br /> Why Choose Us? In a world that's constantly
          moving forward, it's easy to lose track of the moments that matter. At
          NostalgiaNet, we offer more than just storage; we provide a way to
          freeze time. Whether you're looking to revisit a memory next week or
          save something special for the distant future, our platform is
          designed to keep your treasures safe and accessible, whenever you're
          ready to open them again.  <br /><br />How It Works Creating your time capsule is
          simple  <br /><br /> 1. Upload your favorite images or videos. <br /> 2. Set the Date - Choose
          how long you'd like to store them. <br /> 3. Relive - When the time comes,
          you'll be notified, and your memories will be ready to revisit.
          <br /><br /> Our
          Promise Your memories are your most valuable possessions. At
          NostalgiaNet, we prioritize security, privacy, and reliability. Our
          platform is built with cutting-edge technology to ensure that your
          data is always safe and your moments are preserved exactly as you
          remember them. <br /><br /> Thank you for choosing NostalgiaNet. We're honored to
          help you capture and cherish the moments that make life beautiful. <br /><br />
          NostalgiaNet <br />Where memories live forever.
        </div> 
      </div>
    </div>
  );
};

export default About;
