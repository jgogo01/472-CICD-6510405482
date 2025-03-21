import { useState, useEffect } from "react";
import MemberInterface from '../interface/MemberInterface';

export default function Friends() {
    const [isLoading, setLoading] = useState(true);
    const [friends, setFriends] = useState<MemberInterface[] | null>(null);

    useEffect(() => {
        const getFriends = async () => {
            try {
                const response = await fetch('api/member/exclude/' + process.env.NEXT_PUBLIC_STUDENT_ID);
                const data = await response.json();
                const friends: MemberInterface[] = data["data"];
                setFriends(friends);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error(error);
            }
        }
        getFriends();
    }, []);
    return (
        <>
            <div>
                <h1 className="font-bold text-xl mb-2">สมาชิกกลุ่ม</h1>
                {isLoading ? "" : friends && friends?.length > 0 ? friends.map((friend) => {
                    return (
                        <div key={friend.id}>
                            <p>{friend.name} ({friend.id})</p>
                        </div>
                    )
                }) : "404 Not Found"}
            </div>
        </>
    )
}