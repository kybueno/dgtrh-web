export default function (worker: WorkerInfo | null) {
  if (!worker) return "Usuario..";
  
  return `${worker.first_name} ${
    worker.middle_name ? worker.middle_name[0] + ". " : ""
  }${worker.last_name} ${worker.second_last_name || ""}`.trim();
}
