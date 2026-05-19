import { NextResponse } from "next/server"

export function success<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

export function error(message: string, status = 400, extra?: Record<string, unknown>) {
  return NextResponse.json({ success: false, error: message, ...extra }, { status })
}

export function paginated<T>(data: T[], total: number, page: number, perPage: number) {
  return NextResponse.json({
    success: true,
    data,
    meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) },
  })
}
