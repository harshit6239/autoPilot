/* eslint-disable prettier/prettier */
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'
export const cn = (...args) => twMerge(clsx(...args))
