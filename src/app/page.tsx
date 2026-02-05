import Link from "next/link";

const Dashboard = () => {
    return (
        <>
            <h1>ダッシュボード(予定)</h1>
            <Link href={"/problems"}>
                <h2>問題集へ</h2>
            </Link>
        </>
    );
};
export default Dashboard;
