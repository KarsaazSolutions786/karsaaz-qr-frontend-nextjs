'use client'

import { usePlayground } from '@/lib/hooks/usePlayground'
import { EndpointSelector } from './EndpointSelector'
import { RequestBuilder } from './RequestBuilder'
import { ResponseViewer } from './ResponseViewer'
import { CodeSnippets } from './CodeSnippets'
import type { PlaygroundSection } from '@/lib/constants/playground-endpoints'

interface Props {
  sections: PlaygroundSection[]
  basePath: string
  defaultApiKey?: string
}

/**
 * Purpose: Executes PanelHeader functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */
function PanelHeader({ label }: { label: string }) {
  return (
    <div className="shrink-0 border-b border-gray-100 bg-gray-50 px-4 py-2.5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
    </div>
  )
}

/**
 * Purpose: Executes PlaygroundPanel functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */
export function PlaygroundPanel({ sections, basePath, defaultApiKey = '' }: Props) {
  const pg = usePlayground(sections, basePath)
  const effectiveKey = pg.apiKey || defaultApiKey

  return (
    <div className="flex h-[calc(100vh-220px)] min-h-[600px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Left: Endpoint Selector */}
      <div className="flex w-56 shrink-0 flex-col border-r border-gray-200 bg-gray-50">
        <PanelHeader label="Endpoints" />
        <div className="min-h-0 flex-1 overflow-hidden">
          <EndpointSelector
            sections={sections}
            selectedEndpoint={pg.selectedEndpoint}
            onSelect={pg.selectEndpoint}
          />
        </div>
      </div>

      {/* Center: Request Builder */}
      <div className="flex w-80 shrink-0 flex-col border-r border-gray-200">
        <PanelHeader label="Request" />
        <div className="min-h-0 flex-1 overflow-hidden">
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
      </div>

      {/* Right: Response + Code Snippets */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <PanelHeader label="Response" />

        <div className="min-h-0 flex-1 overflow-hidden">
          <ResponseViewer response={pg.response} isLoading={pg.isSending} />
        </div>

        {pg.selectedEndpoint && (
          <div className="shrink-0 border-t border-gray-100 bg-gray-50 p-3">
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
