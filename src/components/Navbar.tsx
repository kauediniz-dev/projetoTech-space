import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { auth, storage, db } from "../firebase/firebaseConection";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useState, useRef, Fragment } from "react";
import { Transition, Dialog } from "@headlessui/react";
import type { Post } from "../models/interfaces/Post";
import { addDoc, collection } from "firebase/firestore";

function Navbar() {
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isNewPostFormValid, setIsNewPostFormValid] = useState(true);
  const [progress, setProgress] = useState(0);
  const [imgUrl, setImgUrl] = useState("");
  const [postAutorInput, setPostAutorInput] = useState("");
  const [postTitleInput, setPostTitleInput] = useState("");
  const [postContentInput, setPostContentInput] = useState("");
  const [postImgFile, setPostImgFile] = useState<File | null>(null);
  const cancelButtonRef = useRef(null);

  const handleSignOut = async () => {
    await signOut(auth)
      .then(() => toast.success("Logout feito com sucesso!"))
      .catch(() => toast.error("Ocorreu um erro, tente novamante!"));
  };

  const handleInputForm = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    state: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const eventTarget = event.currentTarget as HTMLTextAreaElement;
    const eventValue = eventTarget.value;

    eventValue && state(eventValue);
    console.log(eventValue);
  };

  const handlePostImagemInput = (event: React.FormEvent<HTMLInputElement>) => {
    const eventTarget = event.target as HTMLInputElement;
    const file: File | null = eventTarget.files && eventTarget.files[0];

    setPostImgFile(file);
  };

  const handleCreateNewPost = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      postTitleInput.trim().length === 0 ||
      postAutorInput.trim().length === 0 ||
      postContentInput.trim().length === 0
    ) {
      setIsNewPostFormValid(false);
      toast.error("Preencha todos os campos!");
      return;
    }

    if (!postImgFile) {
      toast.error("Selecione uma imagem!");
      return;
    }

    setIsNewPostFormValid(true);
    setIsLoading(true);

    console.log("SUBMIT DISPARADO");
    console.log("Arquivo:", postImgFile);

    const storageRef = ref(storage, `images/${postImgFile.name}`);
    const uplodTask = uploadBytesResumable(storageRef, postImgFile);

    console.log("UPLOAD INICIADO");

    uplodTask.on(
      "state_changed",
      (snapshot) => {
        //.then
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      () => {
        setIsLoading(false);
        toast.error("Erro no upload da imagem!");
      },

      async () => {
        void (await getDownloadURL(uplodTask.snapshot.ref)
          .then(async (url) => {
            if (url) {
              setImgUrl(url);
              const currentDate = getCurrentDate();
              const postObject: Post = {
                author: postAutorInput,
                title: postTitleInput,
                content: postContentInput,
                imgUrl: url,
                userEmail: "teste@teste.com",
                creationDate: currentDate,
              };

              await addDoc(collection(db, "posts"), postObject)
                .then(() => {
                  setIsLoading(false);
                  setPostTitleInput("");
                  setPostContentInput("");
                  setPostAutorInput("");
                  setImgUrl("");
                  setProgress(0);
                  setOpenModal(false);
                  toast.success("Post criado com sucesso!");
                })
                .catch(() => {
                  setIsLoading(false);
                  setPostTitleInput("");
                  setPostContentInput("");
                  setPostAutorInput("");
                  setImgUrl("");
                  setProgress(0);
                  setOpenModal(false);
                  toast.error("Erro ao criar o Post!");
                });
            }
            // Buscar os posts para exibir na tela
          })
          .catch(() => {
            setIsLoading(false);
            toast.error("Erro ao criar o Post!");
          }));
      }
    );
  };

  const getCurrentDate = (): string => {
    const date = new Date();

    const currentDay = String(date.getDate()).padStart(2, "0");
    const currentMonth = String(date.getMonth() + 1).padStart(2, "0");
    const currentYear = date.getFullYear();
    return `${currentDay}/${currentMonth}/${currentYear}`;
  };

  return (
    <>
      {/* NAVBAR */}
      <div className="w-full mx-auto flex flex-wrap gap-5 p-5 flex-col md:flex-row items-center bg-purple-600">
        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 border-0 mt-4 md:mt-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
            />
          </svg>
          Sair
        </button>

        <div className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
          <h1 className="text-4xl text-orange-500 font-mono">Tech Space</h1>
        </div>

        <button
          onClick={() => setOpenModal(!openModal)}
          type="button"
          className="inline-flex items-center rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 border-0 mt-4 md:mt-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Criar Post
        </button>
      </div>
      {/* MODAL DE CRIAR POST */}
      <Transition.Root show={openModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10 "
          initialFocus={cancelButtonRef}
          onClose={setOpenModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out durantion-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-purple-700 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-ceter sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out durantion-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel>
                  <div className="flex flex-col justify-center h-min">
                    <form
                      onSubmit={handleCreateNewPost}
                      className="max-w-[400px] w-full mx-auto bg-purple-600 p-8 px-8 rounded-lg"
                    >
                      <h2 className="text-3xl dark:text-white font-bold text-center">
                        Criar Post
                      </h2>

                      <div className="flex flex-col text-start text-white py-2">
                        <label>Autor</label>
                        <input
                          onChange={(event) =>
                            handleInputForm(event, setPostAutorInput)
                          }
                          type="text"
                          placeholder="Digite o seu nome"
                          className={`w-full rounded-lg mt-2 p-2 ${
                            isNewPostFormValid
                              ? `bg-purple-700 focus:bg-purple-800 `
                              : `bg-red-700 focus:bg-red-800`
                          } bg-purple-700 focus:bg-purple-800 border-2 border-purple-800 focus:border-orange-700 focus:outline-none focus:placeholder-transparent`}
                        />
                      </div>
                      <div className="flex flex-col text-start text-white py-2">
                        <label>Título</label>
                        <input
                          onChange={(event) =>
                            handleInputForm(event, setPostTitleInput)
                          }
                          type="text"
                          placeholder="Digite o Título"
                          className={`w-full rounded-lg mt-2 p-2 ${
                            isNewPostFormValid
                              ? `bg-purple-700 focus:bg-purple-800 `
                              : `bg-red-700 focus:bg-red-800`
                          } bg-purple-700 focus:bg-purple-800 border-2 border-purple-800 focus:border-orange-700 focus:outline-none focus:placeholder-transparent`}
                        />
                      </div>
                      <div className="flex flex-col text-start text-white py-2">
                        <label>Conteúdo</label>
                        <textarea
                          onChange={(event) =>
                            handleInputForm(event, setPostContentInput)
                          }
                          placeholder="Digite o Conteúdo"
                          className={`w-full rounded-lg mt-2 p-2 ${
                            isNewPostFormValid
                              ? `bg-purple-700 focus:bg-purple-800 `
                              : `bg-red-700 focus:bg-red-800`
                          } bg-purple-700 focus:bg-purple-800 border-2 border-purple-800 focus:border-orange-700 focus:outline-none focus:placeholder-transparent`}
                        />
                      </div>
                      <div className="flex flex-col text-start text-white py-2">
                        <label>Capa</label>
                        <input
                          onChange={handlePostImagemInput}
                          type="file"
                          placeholder="Digite o Conteúdo"
                          className="w-full cursor-pointer rounded-lg mt-2 p-2 bg-purple-700 focus:bg-purple-800 border-2 border-purple-800 focus:border-orange-700 focus:outline-none focus:placeholder-transparent"
                        />
                      </div>

                      {!imgUrl && isLoading && (
                        <progress value={progress} max="100" />
                      )}

                      {imgUrl && !isLoading && (
                        <img
                          src={imgUrl}
                          alt="Imagem de capa do post"
                          width={200}
                        />
                      )}

                      <button
                        disabled={isLoading}
                        type="submit"
                        className="w-full my-5 py-2 bg-orange-500 shadow-lg enabled:hover:shadow-orange-500/40 texte-white font-semibold rounded-lg disabled:bg-orange-400 disabled:shadow-none enabled:shadow-orange-500/50"
                      >
                        {isLoading ? "Criando post..." : "Criar"}
                      </button>
                      <button
                        onClick={() => setOpenModal(false)}
                        disabled={isLoading}
                        type="button"
                        className="w-full py-2 bg-red-500 shadow-lg enabled:hover:shadow-red-500/40 texte-white font-semibold rounded-lg disabled:bg-red-400 disabled:shadow-none enabled:shadow-red-500/50"
                      >
                        Cancelar
                      </button>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

export default Navbar;
