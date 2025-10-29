import Card from '../components/ui/Card'
import Page from '../components/motion/Page'
import ChatFeed from '../components/chat/ChatFeed'
import { useState } from 'react'
import { messages as initialMessages } from '../data/messages'

export default function Collaboration() {
  const [msgs, setMsgs] = useState(initialMessages)
  const [typing, setTyping] = useState(false)

  return (
    <Page>
      <div className="container-page space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card title="Messagerie interne">
            <ChatFeed
              messages={msgs}
              typing={typing}
              typingText="Analyste est en train d'écrire…"
              onSend={(text) => {
                const ts = new Date().toTimeString().slice(0,5)
                setMsgs((m) => ([...m, { id: Date.now(), from: 'Vous', role: 'operator', text, time: ts }]))
                setTyping(true)
                // simulate reply
                setTimeout(() => {
                  setTyping(false)
                  setMsgs((m) => ([...m, { id: Date.now()+1, from: 'Analyste IA', role: 'analyst', text: 'Reçu. Je lance une vérification.', time: new Date().toTimeString().slice(0,5) }]))
                }, 1200)
              }}
            />
          </Card>
          <Card title="Planification">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-16 border rounded flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">Créneau</div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Page>
  )
}
