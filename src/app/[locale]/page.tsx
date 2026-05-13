import { DesignKitPreview } from "@/adapter/ui/components/basic/designKit";
import { createMetadataForPage } from "@/infra/metadata";

export function generateMetadata() {
  return createMetadataForPage("design-kit");
}

export default function DesignKitHomePage() {
  return <DesignKitPreview />;
}
