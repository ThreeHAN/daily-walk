export function IconText({ text, icon, iconTextParts }) {
  return iconTextParts(String(text)).map((part, index) =>
    part.icon
      ? <span key={index} className="ic" aria-hidden="true" dangerouslySetInnerHTML={{ __html: icon(part.icon) }} />
      : part.text,
  );
}
