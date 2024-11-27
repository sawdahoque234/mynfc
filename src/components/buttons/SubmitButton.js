import {useFormStatus} from "react-dom";

export default function SubmitButton({children, className = ""}) {
  const {pending} = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={"bg-gradient-to-r from-purple-500 to-blue-500 shadow-md  text-white  py-2 px-4 mx-auto w-full flex gap-2 items-center justify-center hover:bg-blue-300 rounded-md" + className}>
      {pending && <span>Saving...</span>}
      {!pending && children}
    </button>
  );
}
