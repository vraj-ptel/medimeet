
import { toast } from 'sonner'


const ShowMessage = ({message,type}:{message:string,type:"success" | "error"}) => {
  {type=="success"?toast.success(message):toast.error(message)}
}

export { ShowMessage }
