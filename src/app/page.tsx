"use client";
import Image from 'next/image';
import { useState, useEffect } from 'react';
import FriendsComponent from '@/components/FriendsCard';
import StudentInterface from '@/components/types/StudentInterface';

export default function Home() {
    const [isLoading, setLoading] = useState(true);
    const [student, setStudent] = useState<StudentInterface | null>(null); 

    useEffect(() => {
        const getInfomation = async () => {
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_API + '/student/' + process.env.NEXT_PUBLIC_STUDENT_ID);
                const data = await response.json();
                const student: StudentInterface = data["data"];
                setStudent(student);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        }
        getInfomation();
    }, []);
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <div className='flex justify-center mb-5'>
          <Image src="/KU_SubLogo_Thai.png" alt="ku-logo" width="0" height="0"
              sizes="100vw"
              style={{ width: 'auto', height: '100px' }}
          />
        </div>
        <h1 className="text-black-300 text-3xl font-bold mb-2">สวัสดี, {isLoading ? '...' : student ? student.name : '404 Not Found'}
        </h1>
        <h2 className="text-black-300 mb-5 text-xl">รายวิชา 01418472-65 การบูรณาการกระบวนการเชิงอไจล์และเดฟอ็อปส์</h2>
        <FriendsComponent />
      </div>
    </>
  );
}