import { WorkerStatus } from "../generated/enums";
import type { Prisma } from "../generated/client";

type RequireNonNullKeys<T, K extends keyof T> =
    Omit<T, K> & { [P in K]-?: NonNullable<T[P]> }

export type WorkerSeedInfo = RequireNonNullKeys<
    Prisma.WorkerCreateManyInput,
    | "email"
    | "first_name"
    | "last_name"
    | "second_last_name"
    | "record_number"
    | "organizations_codes"
    | "position_code"
>

export const EXAMPLE_WORKERS_INFO: Record<string, WorkerSeedInfo> = {
    director: {
        email: 'lesterr@uci.cu',
        first_name: 'Lester',
        middle_name: '',
        last_name: 'Rodríguez',
        second_last_name: 'Vallejo',
        record_number: '01234',
        organizations_codes: ["cdr", "ujc", "ctc"],
        position_code: 12,
        ci: '04020112346',
        address: 'CR. LA UNA, Nro. 10, Apto. 10, Km: 10, Localidad: RTO. LA BASE, Municipio: SANTA CLARA,VCL',
        parent1_name: 'Juan',
        parent2_name: 'Nery',
        tel: '+53 53344434',
        gender: 'M',
        level: 'SUP',
    },
    hrmanager: {
        email: 'anairis@uci.cu',
        first_name: 'Ana',
        middle_name: 'Iris',
        last_name: 'Valdes',
        second_last_name: 'Rodríguez',
        record_number: '02345',
        organizations_codes: ["cdr", "fmc", "ctc"],
        position_code: 6330,
        ci: '04012312345',
        address: 'AVENIDA 200, NRO. 200, ENTRE: CALLE 200 Y CALLE 298, LOCALIDAD: PUEBLO MIO, MUNICIPIO: BOYEROS',
        parent1_name: 'Pedro',
        parent2_name: 'Juana',
        gender: 'F',
        tel: '+53 52345672',
        level: 'MED',
        status: WorkerStatus.active,
    } ,
workerm: {
        email: 'adrian@uci.cu',
        first_name: 'Adrian',
        middle_name: '',
        last_name: 'Bueno',
        second_last_name: 'Sánchez',
        record_number: '03456',
        organizations_codes: ["cdr", "ujc", "ctc"],
        position_code: 6367,
        ci: '04011312345',
        address: 'Calle A #16 entre B y C',
        parent1_name: 'Juan',
        parent2_name: 'Juana',
        tel: '+53 52345678',
        gender: 'M',
        level: 'MED',
    },
    workers: {
        email: 'juan@uci.cu',
        first_name: 'Juan',
        middle_name: 'Carlos',
        last_name: 'Paredes',
        second_last_name: 'del Río',
        record_number: '03426',
        organizations_codes: ["cdr", "ujc", "ctc"],
        position_code: 6367,
        ci: '04011312327',
        address: 'Calle A #16 entre B y C',
        parent1_name: 'Carlos',
        parent2_name: 'Juana',
        tel: '+53 52345635',
        gender: 'M',
        level: 'SUP',
    },
}
