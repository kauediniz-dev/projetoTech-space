import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConection";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import tech from "../assets/tech2.jpg";

function Login() {
  const [displayLogin, setDisplayLogin] = useState(true);
  const [displaySignUp, setDisplaySignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginPasswordInput, setLoginPasswordInput] = useState("");
  const [loginEmailInput, setLoginEmailInput] = useState("");
  const [isLoginFormValid, setIsLoginFormValid] = useState(true);
  const [isSignUpFormValid, setIsSignUpFormValid] = useState(true);
  const [signUpEmailInput, setSignUpEmailInput] = useState("");
  const [signUpPasswordInput, setSignUpPasswordInput] = useState("");

  const erroAlert = (
    <p className="flex justify-center text-red-300">
      Preencha os campos e tente novamente
    </p>
  );

  const handleDisplayCreateAccount = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    setDisplayLogin(false);
    setDisplaySignUp(true);
  };

  const handleDisplayLogin = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    setDisplayLogin(true);
    setDisplaySignUp(false);
  };

  const handleInputForm = (
    event: React.FormEvent<HTMLInputElement>,
    state: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const eventTarget = event.currentTarget as HTMLInputElement;
    const eventValue = eventTarget.value;

    eventValue && state(eventValue);
  };

  const handleExecuteLogin = async (
    event: React.MouseEvent<HTMLFormElement, MouseEvent>
  ) => {
    setIsLoading(true);
    event.preventDefault();

    loginEmailInput.trim().length > 0 && loginPasswordInput.trim().length > 0
      ? setIsLoginFormValid(true)
      : setIsLoginFormValid(false);

      await signInWithEmailAndPassword(auth, loginEmailInput, loginPasswordInput)
      .then(() => {
        toast.success("Bem vindo de volta!");
        setDisplayLogin(true);
        setDisplayLogin(false);
        setIsLoading(false);
      })
      .catch((err: {code: string}) => {
        setIsLoading(false);
        if (err.code === "auth/wrong-password") {
          toast.error("Senha incorreta");
        }else if(err.code === 'auth/user-not-found') {
          toast.error('Email não existe, crie sua conta');
        } else {
          toast.error('Erro ao fazer login');
          setIsLoginFormValid(false);
        }
      });

    console.log("DADOS DO INPUT", {
      email: loginEmailInput,
      password: loginPasswordInput,
    });

    setLoginEmailInput("");
    setLoginPasswordInput("");
  };

  const handleExecuteSignUp = async (
    event: React.MouseEvent<HTMLFormElement, MouseEvent>
  ) => {
    setIsLoading(true);
    event.preventDefault();

    signUpEmailInput.trim().length > 0 && signUpPasswordInput.trim().length > 0
      ? setIsSignUpFormValid(true)
      : setIsSignUpFormValid(false);

    await createUserWithEmailAndPassword(
      auth,
      signUpEmailInput,
      signUpPasswordInput
    )
      .then(() => {
        setDisplayLogin(true);
        setDisplaySignUp(false);
        setIsLoading(false);
        toast.success('Usuário criado com sucesso!');
      })
      .catch((err: { code: string}) => {
        if (err.code === "auth/week-password") {
          toast.error("Senha muito fraca, utilize outra senha!");
        }else if(err.code === 'auth/email-already-in-use') {
          toast.error('Email já cadastrado');
        } else {
          toast.error('Erro ao criar usuário');
        }

        setIsLoading(false);
        setIsSignUpFormValid(false);
      });

    setSignUpEmailInput("");
    setSignUpPasswordInput("");
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full">
      <div className="hidden sm:block">
        <img
          className="w-full h-screen object-cover"
          src={tech}
          alt="Imagem de um notebook"
        />
      </div>

      <div className="flex flex-col justify-center">
        <div className="flex flex-col justify-center items-center mb-14">
          <h1 className="text-4xl text-orange-500 text-center font-semibold">
            Tech Space👩🏿‍💻
          </h1>
        </div>

        {displayLogin && (
          <form
            onSubmit={handleExecuteLogin}
            className="max-w-[400px] w-full mx-auto bg-purple-600 p-8 rounded-lg shadow-lg"
          >
            <h2 className="text-4xl text-white font-bold text-center mb-6">
              Login
            </h2>

            <div className="flex flex-col text-white py-2">
              <label>Email</label>
              <input
                type="email"
                className={`rounded-lg mt-2 p-2 ${
                  isLoginFormValid
                    ? "bg-purple-700 focus:bg-purple-800"
                    : "bg-red-700 focus:bg-red-800"
                } focus:outline-none focus:placeholder-transparent border-2 border-purple-800`}
                placeholder="Digite seu email"
                onChange={(e) => handleInputForm(e, setLoginEmailInput)}
                value={loginEmailInput}
              />
            </div>

            <div className="flex flex-col text-white py-2">
              <label>Senha</label>
              <input
                type="password"
                value={loginPasswordInput}
                className={`rounded-lg mt-2 p-2 ${
                  isLoginFormValid
                    ? "bg-purple-700 focus:bg-purple-800"
                    : "bg-red-700 focus:bg-red-800"
                } focus:outline-none focus:placeholder-transparent border-2 border-purple-800`}
                placeholder="Digite sua senha"
                onChange={(e) => handleInputForm(e, setLoginPasswordInput)}
                maxLength={20}
                minLength={8}
              />
            </div>

            <div className="flex justify-center text-white py-4 hover:cursor-pointer hover:animate-pulse">
              <button
                type="button"
                onClick={(event) => handleDisplayCreateAccount(event)}
              >
                Criar conta
              </button>
            </div>
            {!isLoginFormValid && erroAlert}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full my-5 py-2 bg-orange-500 shadow-lg enabled:hover:shadow-orange-500/50 text-white font-semibold disabled:bg-orange-400 disabled:shadow-none rounded-lg transition"
            >
              {isLoading ? "Carregando..." : "Fazer login"}
            </button>
          </form>
        )}

        {displaySignUp && (
          <form
            onSubmit={handleExecuteSignUp}
            className="max-w-[400px] w-full mx-auto bg-purple-600 p-8 px-8 rounded-lg"
          >
            <h2 className="text-4xl dark:text-white font-bold text-center">
              Criar Conta
            </h2>

            <div className="flex flex-col text-white py-2">
              <label>Email</label>
              <input
                value={signUpEmailInput}
                onChange={(e) => handleInputForm(e, setSignUpEmailInput)}
                type="email"
                className={`rounded-lg mt-2 p-2 ${
                  isSignUpFormValid
                    ? "bg-purple-700 focus:bg-purple-800"
                    : "bg-red-700 focus:bg-red-800"
                } focus:outline-none focus:placeholder-transparent border-2 border-purple-800`}
                placeholder="Digite seu email"
              />
            </div>
            <div className="flex flex-col text-white py-2">
              <label>Senha</label>
              <input
                type="password"
                className={`rounded-lg mt-2 p-2 ${
                  isSignUpFormValid
                    ? "bg-purple-700 focus:bg-purple-800"
                    : "bg-red-700 focus:bg-red-800"
                } focus:outline-none focus:placeholder-transparent border-2 border-purple-800`}
                placeholder="Crie sua Senha de 8 a 20 caracteres"
                value={signUpPasswordInput}
                onChange={(e) => handleInputForm(e, setSignUpPasswordInput)}
                maxLength={20}
                minLength={8}
              />
            </div>
            <div className="flex justify-center text-white py-2 hover:cursor-pointer hover:animate-pulse">
              <button
                onClick={(event) => handleDisplayLogin(event)}
                type="button"
              >
                Fazer Login
              </button>
            </div>
            {!isSignUpFormValid && erroAlert}
            <button
              disabled={isLoading}
              type="submit"
              className="w-full my-5 py-2 bg-orange-500 shadow-lg enabled:hover:shadow-orange-500/50 text-white font-semibold disabled:bg-orange-400 disabled:shadow-none rounded-lg transition"
            >
              {isLoading ? "Carregando" : 'Criar Conta'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
