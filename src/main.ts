import { langs } from './lang'
import dayjs from 'dayjs'

export function supportLanguages(): string[] {
  return langs.map(([key]) => key)
}

export function translate(query: Bob.TranslateQuery, completion: Bob.Completion) {
  const { unit, format } = $option
  const text = query.text.trim()

  if (!dayjs(text).isValid()) {
    completion({
      error: {
        type: 'unknown',
        message: '时间格式不合法',
        addtion: '',
      },
    })
    return
  }

  // 判断是否是时间戳
  const timestamp = Number(text)
  if (isNaN(timestamp)) {
    let result = ''
    if (unit === 's') {
      result = dayjs(text).unix().toString()
    } else {
      result = dayjs(text).valueOf().toString()
    }
    completion({
      result: {
        from: query.detectFrom,
        to: query.detectTo,
        toParagraphs: [result],
      },
    })
  } else {
    const result = timestamp.toString().length === 10 ? dayjs.unix(timestamp).format(format.trim()) : dayjs(timestamp).format(format.trim())
    completion({
      result: {
        from: query.detectFrom,
        to: query.detectTo,
        toParagraphs: [result],
      },
    })
  }
}
