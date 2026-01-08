import loginImg from "../assets/daniel-korpai-HyTwtsk8XqA-unsplash.jpg";

function Login() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full">
      <div className="hidden sm:block">
        <img
          className="w-full h-screen object-cover"
          src={loginImg}
          alt="Imagem de um notebook"
        />
      </div>

      <div className="flex flex-col justify-center">
        <div className="flex flex-col justify-center align-itens-center mb-14">
          <h1 className="text-4xl text-orange-500 text-center font-semibold">
            Tech Space 👨‍💻
          </h1>
        </div>

        <form className="max-h-[400px] w-full mx-auto bg-purple-600 p-8 rounded-lg">
          <h2 className="text-4xl dark:text-white font-bold text-center">
            Login
          </h2>
          <div className="flex flex-col text-white py-2">
            <label>Email</label>
            <input type="email" className="rounded-lg mt-2 p-2 bg-purple-700 focus:bg-orange-700 focus:outline-none focus:placeholder-transparent border-2 border-purple-800 " />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
