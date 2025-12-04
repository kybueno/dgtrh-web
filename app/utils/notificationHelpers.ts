interface NotifyOpts{error?:Error,description?:string,title?:string}
type NotificationType = "error"|"success"|"warning"|"info"
const typeOptsMap:{[key:string]:{icon:string,defaultTitle:string}} = {
    info:{icon:"mdi:info",defaultTitle:"Información"},
    success:{icon:"mdi:check",defaultTitle:"Éxito"},
    warning:{icon:"mdi:warning",defaultTitle:"Atención"},
    error:{icon:"mdi:error",defaultTitle:"Error"},
}
export default function notifyUser(type:NotificationType,opts?:NotifyOpts){
const toast = useToast()

return toast.add({
    description:opts?.description??opts?.error?.message,
    title:opts?.title ?? typeOptsMap[type]?.defaultTitle,
    color:type,
    icon:typeOptsMap[type]?.icon
})
}

export const notifySuccess = (opts:NotifyOpts) => notifyUser("success",opts)
export const notifyInfo = (opts:NotifyOpts) => notifyUser("info",opts)
export const notifyWarning = (opts:NotifyOpts) => notifyUser("warning",opts)
export const notifyError = (opts:NotifyOpts) => notifyUser("error",opts)