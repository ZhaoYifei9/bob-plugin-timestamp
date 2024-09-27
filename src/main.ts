import { langs } from './lang'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export function supportLanguages(): string[] {
  return langs.map(([key]) => key)
}

export function translate(query: Bob.TranslateQuery, completion: Bob.Completion) {
  const { unit, format, timezone} = $option
  const text = query.text.trim()

  // 获取当前时间戳
  if (text === 'now') {
    const currentTimestamp = unit === 's' ? dayjs().unix().toString() : dayjs().valueOf().toString();
    completion({
      result: {
        from: query.detectFrom,
        to: query.detectTo,
        toParagraphs: [currentTimestamp],
      },
    });
    return;
  }

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
    const result = timestamp.toString().length === 10 ? dayjs.unix(timestamp).tz(timezone.trim()).format(format.trim()) : dayjs(timestamp).tz(timezone.trim()).format(format.trim())
    completion({
      result: {
        from: query.detectFrom,
        to: query.detectTo,
        toParagraphs: [result],
      },
    })
  }
}
