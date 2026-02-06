import { Loader2 } from "lucide-react";

const Loading = () => {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                <p className="mt-4 text-muted-foreground">読み込み中...</p>
            </div>
        </div>
    );
};

export default Loading;
