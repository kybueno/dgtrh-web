export default function (worker: WorkerInfo | null) {
  if (!worker) return "Usuario..";
  return `${worker.first_name} ${
    worker.middleName ? worker.middleName[0] + ". " : ""
  }${worker.lastName} ${worker.secondLastName || ""}`.trim();
}
