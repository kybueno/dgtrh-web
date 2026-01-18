export default function (data: {first_name:string,middle_name:string|null,last_name:string,second_last_name:string} | null | undefined) {
  if (!data) return "Usuario";
  
  return `${data.first_name} ${
    data.middle_name ? data.middle_name[0] + ". " : ""
  }${data.last_name} ${data.second_last_name || ""}`.trim();
}

export function getNameInitials(data: {first_name: string, last_name: string} | null | undefined) {
  if (!data) return "U"; //U = Usuario
  
  return `${data.first_name[0]}${data.last_name[0]}`.toUpperCase();
}