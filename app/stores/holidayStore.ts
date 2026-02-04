export const holidays = ref<HolidaysInfo[]>([])

export const holidaysPending = ref(false)
export interface HolidaysInfo extends Tables<'holidays'> {}

async function wrapFetch<T>(promise: Promise<T>) {
  try {
    const data = await promise
    return { data, error: null as any }
  } catch (error) {
    return { data: null as any, error }
  }
}

export async function loadHolidays() {
  holidaysPending.value = true
  const response = await wrapFetch($fetch<HolidaysInfo[]>('/api/holidays'))
  const { data, error } = response
  holidaysPending.value = false
  if (data) holidays.value = data
  if (error) console.error(error)

  return response
}

export async function addHoliday(newHolidayData: TablesInsert<'holidays'>) {
  const response = await wrapFetch(
    $fetch<HolidaysInfo>('/api/holidays', {
      method: 'POST',
      body: newHolidayData,
    })
  )

  const { data, error } = response

  if (data) console.log(data)
  if (error) console.error(error)

  return response
}
