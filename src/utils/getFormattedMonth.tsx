const getFormattedMonth = (date: string) => +date > 9 ? date : '0' + date;

export  const dateFormatted = (data: any) => data.map((a:any) => new Date(a.date).getDate().toString() + '/' + getFormattedMonth(new Date(a.date).getMonth().toString()))