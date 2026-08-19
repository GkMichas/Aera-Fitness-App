import {
  referenceScreens,
  type ReferenceScreenName,
} from "@/lib/reference-screens.generated";

export function ReferenceScreen({ name }: { name: ReferenceScreenName }) {
  return (
    <main className="reference-stage" aria-label={`${name} screen`}>
      <div
        className="reference-phone"
        dangerouslySetInnerHTML={{ __html: referenceScreens[name] }}
      />
    </main>
  );
}
