import { motion, AnimatePresence } from 'framer-motion'

export default function ChatFeed({ messages = [], onSend, typing = false, typingText = 'Quelqu\'un écrit…' }) {
  return (
    <div className="flex flex-col h-80">
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        <AnimatePresence initial={false}>
          {messages.map(m => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className={`max-w-[80%] px-3 py-2 rounded ${m.role === 'operator' ? 'bg-blue-50 border border-blue-200 self-start' : 'bg-gray-100 border border-gray-200 self-end'}`}
            >
              <div className="text-[11px] text-gray-500">{m.from} · {m.time}</div>
              <div className="text-sm text-gray-800">{m.text}</div>
            </motion.div>
          ))}
          {typing && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="max-w-[60%] px-3 py-2 rounded bg-gray-100 border border-gray-200 self-start"
            >
              <div className="text-[11px] text-gray-500">Analyste · maintenant</div>
              <div className="text-sm text-gray-800 inline-flex items-center gap-2">
                <span>{typingText}</span>
                <span className="inline-flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '100ms' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '200ms' }} />
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <form
        className="mt-2 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          const input = e.currentTarget.elements.namedItem('msg')
          const value = input?.value?.trim()
          if (value) {
            onSend?.(value)
            input.value = ''
          }
        }}
      >
        <input name="msg" className="input h-10" placeholder="Votre message..." />
        <button className="btn btn-primary" type="submit">Envoyer</button>
      </form>
    </div>
  )
}
