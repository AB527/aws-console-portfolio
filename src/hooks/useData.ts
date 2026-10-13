"use client"

import { useCallback, useEffect, useState } from "react"
import type allServices from "@data/all-services.json"
import type announcements from "@data/announcements.json"
import type blogPosts from "@data/blog-posts.json"
import type ec2Projects from "@data/ec2-projects.json"
import type explore from "@data/explore.json"
import type github from "@data/github.json"
import type iamGroups from "@data/iam-groups.json"
import type iamUsers from "@data/iam-users.json"
import type knowMe from "@data/know-me.json"
import type notifications from "@data/notifications.json"
import type s3 from "@data/s3.json"
import type solutions from "@data/solutions.json"
import type vpc from "@data/vpc.json"

// Content files, fetched by the browser from /data/<name>.json
export interface ContentData {
  "all-services": typeof allServices
  announcements: typeof announcements
  "blog-posts": typeof blogPosts
  "ec2-projects": typeof ec2Projects
  explore: typeof explore
  github: typeof github
  "iam-groups": typeof iamGroups
  "iam-users": typeof iamUsers
  "know-me": typeof knowMe
  notifications: typeof notifications
  s3: typeof s3
  solutions: typeof solutions
  vpc: typeof vpc
}

export type DataName = keyof ContentData

export interface DataState<T> {
  data: T | null
  error: boolean
  reload: () => void
}

// Components that mount together share one request; nothing is kept once it settles
const inFlight = new Map<DataName, Promise<unknown>>()

function load<K extends DataName>(name: K): Promise<ContentData[K]> {
  const pending = inFlight.get(name)
  if (pending) return pending as Promise<ContentData[K]>

  const request = fetch(`/data/${name}.json`, { cache: "no-store" })
    .then((res) => {
      if (!res.ok) throw new Error(`${name}.json responded ${res.status}`)
      return res.json() as Promise<ContentData[K]>
    })
    .finally(() => inFlight.delete(name))
  inFlight.set(name, request)
  return request
}

// Fetches a content file every time the component mounts. `data` is null while loading.
export function useData<K extends DataName>(name: K): DataState<ContentData[K]> {
  const [state, setState] = useState<{ data: ContentData[K] | null; error: boolean }>({ data: null, error: false })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    load(name).then(
      (data) => {
        if (active) setState({ data, error: false })
      },
      () => {
        if (active) setState({ data: null, error: true })
      }
    )
    return () => {
      active = false
    }
  }, [name, attempt])

  const reload = useCallback(() => {
    setState({ data: null, error: false })
    setAttempt((n) => n + 1)
  }, [])

  return { ...state, reload }
}
