import styles from "@/styles/analytics.module.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

interface ChartProps {
  responseTimeData?: { name: string; value: number }[];
  title?: string;
  dailyUsageData?: [string, number][];
  avgRespTime?: number;
}

const Charts: React.FC<ChartProps> = ({
  responseTimeData = [],
  title,
  dailyUsageData = [],
  avgRespTime,
}) => {
  return (
    <div className={`md:flex gap-6`}>
      <div className="flex items-start gap-4 justify-center flex-1 mb-6 md:mb-0">
        <div className="flex flex-col gap-2 flex-1 bg-white-900 rounded-xl border-[#E8ECF0] border pr-4 h-full">
          <h2 className="font-semibold p-8 ">Daily Usage</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              width={550}
              height={100}
              data={dailyUsageData}
              margin={{ top: 5, right: 30, left: 30, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                label={{
                  value: "Days",
                  angle: 0,
                  position: "insideBottom",
                  offset: -15,
                }}
              />
              <YAxis
                label={{
                  value: "No. of Queries",
                  style: { textAnchor: "middle" },
                  angle: -90,
                  position: "left",
                  offset: 0,
                }}
              />
              <Tooltip />
              <Bar dataKey="value" fill="#0755E9" barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="md:flex items-start gap-2 justify-center flex-1 bg-white-900 rounded-xl relative border-[#E8ECF0] border">
        <div className="flex flex-col  gap-2 flex-1">
          <div className="flex justify-between items-center p-8 flex-wrap gap-2">
            <h2 className="font-semibold">Response Time</h2>
            <div className="">
              <p className="text-[12px] rounded-[4px] bg-white-900 font-medium text-[#585F6B] flex items-center gap-1 justify-center">
                <span className="size-[8px] bg-[#fff] border border-[#0755e9] rounded-full block"></span>{" "}
                Avg Response Time:{" "}
                <span className="font-semibold">{avgRespTime}</span>
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              width={550}
              height={100}
              className="w-full"
              data={responseTimeData}
              margin={{ top: 5, right: 30, left: 30, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                label={{
                  value: "Queries",
                  angle: 0,
                  position: "insideBottom",
                  offset: -15,
                }}
              />
              <YAxis
                label={{
                  value: "Time(s)",
                  style: { textAnchor: "middle" },
                  angle: -90,
                  position: "left",
                  offset: 0,
                }}
              />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#0755E9" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Charts;
