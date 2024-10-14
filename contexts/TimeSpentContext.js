import { createContext, useState, useEffect } from 'react';
import instance from '@/utils/axiosInstance';

const TimeSpentContext = createContext();

const TimeSpentProvider = ({ children }) => {
  const [startTime, setStartTime] = useState(() => {
    const savedStartTime = localStorage.getItem('startTime');
    return savedStartTime ? parseInt(savedStartTime, 10) : Date.now();
  });
  const [timeSpent, setTimeSpent] = useState(() => {
    const savedTimeSpent = localStorage.getItem('timeSpent');
    return savedTimeSpent ? parseInt(savedTimeSpent, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('startTime', startTime);

    const handleUnload = async () => {
      const endTime = Date.now();
      const totalTimeSpent = endTime - startTime;
      localStorage.setItem('timeSpent', totalTimeSpent);
      // await logTime(totalTimeSpent/60000);
      console.log("Time spent: ", totalTimeSpent / 60000, " minutes");
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [startTime, timeSpent]);

  const logTime = async (totalTimeSpent) => {
    await instance.patch("/update_user", {
      //@ts-ignore
      time: totalTimeSpent,
    });
  };

  const resetTimeSpent = () => {
    setStartTime(Date.now());
    setTimeSpent(0);
    localStorage.removeItem('startTime');
    localStorage.removeItem('timeSpent');
  };

  const handleUnload = async () => {
    const endTime = Date.now();
    const totalTimeSpent = (endTime - startTime);
    localStorage.setItem('timeSpent', totalTimeSpent);
    await logTime(totalTimeSpent/60000);
    console.log("Time spent: ", totalTimeSpent / 60000, " minutes");
    resetTimeSpent();
  };

  return (
    <TimeSpentContext.Provider value={{ timeSpent, handleUnload }}>
      {children}
    </TimeSpentContext.Provider>
  );
};

export { TimeSpentContext, TimeSpentProvider };
