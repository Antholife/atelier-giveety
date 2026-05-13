import { DesignKitPreview } from "@/adapter/ui/components/basic/designKit";
import { createMetadataForPage } from "@/infra/services";

export function generateMetadata() {
  return createMetadataForPage("atelier-ui-ux");
}

export default function AtelierUiUxPage() {
  return <DesignKitPreview />;
}
