import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, Search } from "lucide-react";

type Props = {
    searchText: string;
    onSearchChange: (v: string) => void;
    categories: string[];
    selectedCategory: string;
    onSelectCategory: (v: string) => void;
};

export function ProblemsFilter({
    searchText,
    onSearchChange,
    categories,
    selectedCategory,
    onSelectCategory,
}: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    フィルター
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <input
                        value={searchText}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        placeholder="検索"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {categories.map((c) => (
                        <Button
                            key={c}
                            size="sm"
                            variant={
                                selectedCategory === c ? "default" : "secondary"
                            }
                            onClick={() => onSelectCategory(c)}
                        >
                            {c}
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
