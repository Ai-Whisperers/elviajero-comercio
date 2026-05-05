## WhatsApp AI Agent — Integration Plan

El Viajero already uses WhatsApp for ordering. The AI Agent can handle:
- Product inquiries ("Do you have tent X in stock?")
- Order status ("Where's my order?")
- Recommendations ("What camping stove do you recommend?")
- Support ("My tent is damaged, what do I do?")

### Connection

El Viajero's Supabase project `qyvokpribmbrosafntqa` is already accessible by the AI Agent.

### Integration Steps

1. **Create an Evolution instance** for El Viajero's WhatsApp Business number
2. **Replace the static WhatsApp float** with a link that opens the AI-powered number
3. **Seed LightRAG** with: product catalog, FAQ, shipping policies
4. **Add `docs/whatsapp-ai-integration.md`** with connection details

### API Reference

See `/root/paragu-ai-builder/docs/whatsapp-ai-integration.md` for full API docs.
