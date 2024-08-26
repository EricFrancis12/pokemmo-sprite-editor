import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function IconWithTooltip({ icon, tooltip, className }: {
    icon: IconDefinition;
    tooltip: React.ReactNode;
    className?: string;
}) {
    return (
        <div className="flex group">
            <FontAwesomeIcon icon={icon} className={className} />
            <div className="relative hidden group-hover:block">
                <div className="absolute px-2 border border-black rounded-md" style={{ whiteSpace: "nowrap" }}>
                    {tooltip}
                </div>
            </div>
        </div>
    )
}