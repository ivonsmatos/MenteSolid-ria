// Serializa para JSON e escapa "<" para evitar fechar a tag <script> caso o
// payload contenha "</script>". Necessário em qualquer JSON-LD inline.
function safeJson(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: safeJson(data) }}
      type="application/ld+json"
    />
  );
}
