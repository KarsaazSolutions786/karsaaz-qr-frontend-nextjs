'use client'

import { usePlayground } from '@/lib/hooks/usePlayground'
import { EndpointSelector } from './EndpointSelector'
import { RequestBuilder } from './RequestBuilder'
import { ResponseViewer } from './ResponseViewer'
import { CodeSnippets } from './CodeSnippets'
import type { PlaygroundSection } from '@/lib/constants/playground-endpoints'

interface Props {
  sections: PlaygroundSection[]
  basePath: string // '/v1' for user, '/v1/org' for org
  defaultApiKey?: string // optional pre-fill from parent
}

export function PlaygroundPanel({ sections, basePath, defaultApiKey = '' }: Props) {
  const pg = usePlayground(sections, basePath)

  // Use parent-provided key as fallback when user hasn't typed one
  const effectiveKey = pg.apiKey || defaultApiKey

  return (
    <div className="flex h-[calc(100vh-180px)] min-h-[600px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Left: Endpoint Selector */}
      <div className="w-52 shrink-0 border-r border-gray-200 bg-gray-50">
        <div className="border-b border-gray-200 px-3 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Endpoints</p>
        </div>
        <EndpointSelector
          sections={sections}
          selectedEndpoint={pg.selectedEndpoint}
          onSelect={pg.selectEndpoint}
        />
      </div>

      {/* Center: Request Builder */}
      <div className="w-80 shrink-0 border-r border-gray-200">
        <div className="border-b border-gray-200 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Request</p>
        </div>
        <RequestBuilder
          endpoint={pg.selectedEndpoint}
          apiKey={effectiveKey}
          fullUrl={pg.fullUrl}
          pathParams={pg.pathParams}
          queryParams={pg.queryParams}
          requestBody={pg.requestBody}
          isSending={pg.isSending}
          onApiKeyChange={pg.setApiKey}
          onPathParamChange={pg.setPathParam}
          onQueryParamChange={pg.setQueryParam}
          onBodyChange={pg.setRequestBody}
          onSend={pg.send}
        />
      </div>

      {/* Right: Response + Code Snippets */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Response section header — outside flex-1 so h-full in ResponseViewer is correct */}
        <div className="shrink-0 border-b border-gray-200 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Response</p>
        </div>

        {/* Response viewer */}
        <div className="min-h-0 flex-1 overflow-hidden">
          <ResponseViewer response={pg.response} isLoading={pg.isSending} />
        </div>

        {/* Code snippets */}
        {pg.selectedEndpoint && (
          <div className="shrink-0 border-t border-gray-200 p-3">
            <CodeSnippets
              method={pg.selectedEndpoint.method}
              fullUrl={pg.fullUrl}
              apiKey={effectiveKey}
              body={pg.requestBody}
            />
          </div>
        )}
      </div>
    </div>
  )
}
