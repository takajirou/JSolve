import { ProblemSolvePage } from "@/features/problems/[id]/components/ProblemSolvePage";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
    const { id } = await params;
    return <ProblemSolvePage problemId={id} />;
}
