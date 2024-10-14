import * as React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import ReactMarkdown from "react-markdown";
import styles from "@/styles/chat.module.css";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  TableProperties,
  BarChart4,
  Search,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useLayoutEffect, useState } from "react";
import instance from "@/utils/axiosInstance";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Charts from "../charts/charts";
import InputField from "../common/InputField";
import { Checkbox } from "../ui/checkbox";
import { toast } from "react-toastify";
import ActionPopup from "../common/actionPopup";

export type User = {
  id: string;
  name: string;
  // email: string;
  question: string;
  answer: string;
  review: string | null;
  rating: string | null;
  time_stamp: string;
  response_time: number | string;
};
const formatTimeStamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

const formatNumber = (number: number): string => {
  return number.toFixed(2);
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: () => (
      <div className="text-[#6C737F] uppercase text-[12px] font-medium">
        Name
      </div>
    ),
    cell: ({ row }) => (
      <div className="capitalize text-black-900 max-w-[180px] min-w-[180px] overflow-hidden text-ellipsis">
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "question",
    header: () => (
      <div className="text-[#6C737F] uppercase text-[12px] font-medium">
        Question
      </div>
    ),
    cell: ({ row }) => (
      <div className=" text-black-900 maxLine">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[remarkRehype, rehypeKatex]}
          className="p-0">
          {row.getValue("question")}
        </ReactMarkdown>
      </div>
    ),
  },
  {
    accessorKey: "answer",
    header: () => (
      <div className="text-[#6C737F] uppercase text-[12px] font-medium">
        Answer
      </div>
    ),
    cell: ({ row }) => (
      <div className=" text-black-900 maxLine">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[remarkRehype, rehypeKatex]}
          className="p-0">
          {row.getValue("answer")}
        </ReactMarkdown>
      </div>
    ),
  },

  {
    accessorKey: "response_time",
    header: () => (
      <div className="text-[#6C737F] whitespace-nowrap uppercase text-[12px] font-medium">
        Response Time(s)
      </div>
    ),
    cell: ({ row }) => (
      <div className=" text-black-900 text-center">
        {formatNumber(row.getValue("response_time"))}
      </div>
    ),
  },
  {
    accessorKey: "rating",
    header: () => (
      <div className="text-[#6C737F] uppercase text-[12px] font-medium">
        Rating
      </div>
    ),
    cell: ({ row }) => (
      <div className=" text-black-900 text-center">
        {row.getValue("rating")}
      </div>
    ),
  },
  {
    accessorKey: "review",
    header: () => (
      <div className="text-[#6C737F] uppercase text-[12px] font-medium">
        Review
      </div>
    ),
    cell: ({ row }) => (
      <div className=" text-black-900  group relative">
        {row.getValue("review")}
      </div>
    ),
  },
  {
    accessorKey: "time_stamp",
    header: () => (
      <div className="text-[#6C737F] uppercase text-[12px] font-medium whitespace-nowrap">
        Time Stamp (UTC)
      </div>
    ),
    cell: ({ row }) => (
      <div className=" text-black-900 whitespace-nowrap">
        {formatTimeStamp(row.getValue("time_stamp"))}
      </div>
    ),
  },
  {
    accessorKey: "action",
    header: () => (
      <div className="text-[#6C737F] uppercase text-[12px] font-medium">
        Action
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <ActionPopup rowData={row.original} />
      </div>
    ),
  },
];

const EngineeringTable = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = useState([]);
  const [responseTimeData, setResponseTimeData] = useState([]);
  const [dailyUsageData, setDailyUsageData] = useState([]);
  const [avgRespTime, setAvgTime] = useState<number>();

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      columnPinning: { right: ["action"] },
      pagination: {
        pageSize: 50,
      },
    },
  });
  useLayoutEffect(() => {
    const fetchTable = async () => {
      try {
        const response = await instance.get("/analysis_ask_engr");
        const formattedData = response.data.map(
          (item: any[], index: number) => ({
            id: index.toString(),
            name: item[0],
            // email: item[1],
            question: item[2],
            answer: item[3],
            review: item[4],
            rating: item[5],
            time_stamp: item[6].toLocaleString(),
            response_time: item[7],
          })
        );
        setData(formattedData);
        console.log(
          formattedData,
          "formattedDataformattedDataformattedDataformattedDataformattedData"
        );
      } catch (err) {
        console.log("Error fetching Table");
      }
    };
    fetchTable();

    const fetchResponseTime = async () => {
      try {
        const response = await instance.get("/analysis_ask_engr_response_time");
        const avgResponseTime = response.data.avg.toFixed(2);
        const data = response.data.values.map(
          (value: number, index: number) => ({
            name: index,
            value,
          })
        );
        setAvgTime(avgResponseTime);
        setResponseTimeData(data);
      } catch (error) {
        console.error("Error fetching response time data:", error);
      }
    };
    fetchResponseTime();

    const fetchDailyUsage = async () => {
      try {
        const response = await instance.get("/analysis_ask_engr_daily_usage");
        const data = response.data.map((item: [string, number]) => ({
          name: new Date(item[0]).toISOString().split("T")[0],
          value: item[1],
        }));
        setDailyUsageData(data);
      } catch (error) {
        console.error("Error fetching daily usage data:", error);
      }
    };
    fetchDailyUsage();
  }, []);
  return (
    <div className="">
      <div className="h-full">
        <div className={`chartsWrap mb-6`}>
          <Charts
            responseTimeData={responseTimeData}
            dailyUsageData={dailyUsageData}
            avgRespTime={avgRespTime}
          />
        </div>
      </div>
      <div className="border-[#E8ECF0] border rounded-xl bg-white-900 max-h-full overflow-auto">
        <div className="flex items-center justify-between py-5 px-6 flex-wrap gap-4">
          <p className="font-bold headingText leading-5">Analytics</p>
          <div className="flex items-center gap-3">
            <div className="md:min-w-[280px] relative">
              <InputField
                placeholder="Search by Name"
                value={
                  (table.getColumn("name")?.getFilterValue() as string) ?? ""
                }
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const newValue = event.target.value;
                  const trimmedValue = newValue.trim();

                  table.getColumn("name")?.setFilterValue(trimmedValue);
                }}
                className="max-w-[300px] h-[44px] !mt-0 pl-9 pr-4 placeholder:text-[12px] md:placeholder:text-[14px]"
                type={"text"}
              />
              <Search
                size={16}
                className="absolute top-[50%] -translate-y-[50%] left-3"
              />
            </div>
          </div>
        </div>
        <Table className="customTable">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-[#E6EFFF]">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className=""
                      style={{
                        position: header.column.getIsPinned()
                          ? "sticky"
                          : "static",
                        right:
                          header.column.getIsPinned() === "right" ? 0 : "auto",
                        background: header.column.getIsPinned()
                          ? "#E6EFFF"
                          : "transparent",
                        zIndex: header.column.getIsPinned() ? 1 : "auto",
                      }}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b-[#DDE1E7] hover:bg-[#E7EFFF] group">
                  {row.getVisibleCells().map((cell: any) => {
                    const isPinned = cell.column.getIsPinned();
                    const pinnedStyles = isPinned
                      ? {
                          position: "sticky" as const,
                          right:
                            cell.column.getIsPinned() === "right" ? 0 : "auto",
                          zIndex: 1,
                        }
                      : {};

                    return (
                      <TableCell
                        key={cell.id}
                        style={{
                          ...pinnedStyles,
                          transition: "background-color 0.2s",
                        }}
                        className={`
                          group-hover:bg-[#E7EFFF] 
                          ${isPinned ? "bg-white-900 " : ""}
                        `}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center">
                  {data.length ? "No matching records found" : "Loading..."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between space-x-2 p-4 border-t border-[#DDE1E7]">
          <div className="text-sm text-muted-foreground text-gray-500">
            Showing {table.getRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s).
          </div>
          <div className="flex items-center">
            <Button
              className="bg-transparent	disabled:bg-transparent border-0 h-[20px]"
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}>
              <ChevronLeft color="#1B232E" />
            </Button>
            <Button
              variant="outline"
              className="bg-transparent	disabled:bg-transparent border-0 h-[20px]"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}>
              <ChevronRight color="#1B232E" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngineeringTable;
