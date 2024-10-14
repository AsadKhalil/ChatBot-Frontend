import * as React from "react";
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
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import ReactMarkdown from "react-markdown";
import logoSmall from "../../assets/logo.png";
import Image from "next/image";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  ChevronLeft,
  Maximize2,
  TableProperties,
  BarChart4,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "@/components/ui/button";
import InputField from "../common/InputField";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import instance from "@/utils/axiosInstance";
import { useState } from "react";
import Charts from "../charts/charts";

export type User = {
  id: string;
  name: string;
  email: string;
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

const formatNumbers = (number: number): string => {
  return number.toFixed(2);
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: () => <div className="text-[#52607A]">Name</div>,
    cell: ({ row }) => (
      <div className="capitalize text-black-900">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: () => <div className="text-[#52607A]">Email</div>,
    cell: ({ row }) => (
      <div className="lowercase text-black-900">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "question",
    header: () => <div className="text-[#52607A]">Question</div>,
    cell: ({ row }) => (
      <div className=" text-black-900 maxLine group ">
        <Dialog>
          <DialogTrigger asChild>
            <span className="justify-end flex h-[16px] cursor-pointer">
              <Maximize2
                size={16}
                strokeWidth={1}
                className="hidden group-hover:block"
              />
            </span>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[715px] bg-white-900">
            <div className="max-h-[500px] overflow-auto mt-[30px]">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[remarkRehype, rehypeKatex]}
                className="p-0">
                {row.getValue("question")}
              </ReactMarkdown>
            </div>
          </DialogContent>
        </Dialog>
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
    header: () => <div className="text-[#52607A]">Answer</div>,
    cell: ({ row }) => (
      <div className=" text-black-900 maxLine group ">
        <Dialog>
          <DialogTrigger asChild>
            <span className="justify-end flex h-[16px] cursor-pointer">
              <Maximize2
                size={16}
                strokeWidth={1}
                className="hidden group-hover:block"
              />
            </span>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[715px] bg-white-900">
            <div className="max-h-[500px] overflow-auto mt-[30px]">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[remarkRehype, rehypeKatex]}
                className="p-0">
                {row.getValue("answer")}
              </ReactMarkdown>
            </div>
          </DialogContent>
        </Dialog>
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
    accessorKey: "time_stamp",
    header: () => <div className="text-[#52607A]">Time Stamp (UTC)</div>,
    cell: ({ row }) => (
      <div className=" text-black-900 whitespace-nowrap">
        {formatTimeStamp(row.getValue("time_stamp"))}
      </div>
    ),
  },
  {
    accessorKey: "response_time",
    header: () => (
      <div className="text-[#52607A] whitespace-nowrap">Response Time(s)</div>
    ),
    cell: ({ row }) => (
      <div className=" text-black-900 text-center">
        {formatNumbers(row.getValue("response_time"))}
      </div>
    ),
  },
  {
    accessorKey: "rating",
    header: () => <div className="text-[#52607A]">Rating</div>,
    cell: ({ row }) => (
      <div className=" text-black-900 text-center">
        {row.getValue("rating")}
      </div>
    ),
  },
  {
    accessorKey: "review",
    header: () => <div className="text-[#52607A]">Review</div>,
    cell: ({ row }) => (
      <div className=" text-black-900 maxLine group ">
        <Dialog>
          <DialogTrigger asChild>
            {row.getValue("review") ? (
              <span className="justify-end flex h-[16px] cursor-pointer">
                <Maximize2
                  size={16}
                  strokeWidth={1}
                  className="hidden group-hover:block"
                />
              </span>
            ) : (
              ""
            )}
          </DialogTrigger>
          <DialogContent className="sm:max-w-[715px] bg-white-900">
            <div className="max-h-[500px] overflow-auto mt-[30px]">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[remarkRehype, rehypeKatex]}
                className="p-0">
                {row.getValue("review")}
              </ReactMarkdown>
            </div>
          </DialogContent>
        </Dialog>
        {row.getValue("review")}
      </div>
    ),
  },
];
const HrTable = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [data, setData] = useState([]);

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [showCharts, setShowCharts] = useState(false);
  const [dailyUsageData, setDailyUsageData] = useState([]);
  const [responseTimeData, setResponseTimeData] = useState([]);
  const [avgRespTime, setAvgTime] = useState<number>();

  const chartHandler = () => {
    setShowCharts(true);
  };

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
  });
  React.useLayoutEffect(() => {
    const fetchTable = async () => {
      try {
        const response = await instance.get("/analysis_ask_hr");
        const formattedData = response.data.map(
          (item: any[], index: number) => ({
            id: index.toString(),
            name: item[0],
            email: item[1],
            question: item[2],
            answer: item[3],
            review: item[4],
            rating: item[5],
            time_stamp: item[6].toLocaleString(),
            response_time: item[7],
          })
        );
        setData(formattedData);
      } catch (err) {
        console.log("Error fetching Table");
      }
    };
    fetchTable();

    const fetchDailyUsage = async () => {
      try {
        const response = await instance.get("/analysis_ask_hr_daily_usage");
        const data = response.data.map((item: [string, number]) => ({
          name: new Date(item[0]).toISOString().split("T")[0],
          value: item[1],
        }));
        setDailyUsageData(data);
      } catch (error) {
        console.log("Error fetching Daily Usage:", error);
      }
    };
    fetchDailyUsage();

    const fetchResponseData = async () => {
      try {
        const response = await instance.get("/analysis_ask_hr_response_time");
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
        console.log("Error fetching Response Time:", error);
      }
    };
    fetchResponseData();
  }, []);
  return (
    <div className="w-full">
      <div className="mb-4 flex justify-end gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                onClick={() => setShowCharts(false)}
                className={`${
                  !showCharts ? "bg-blue-400 " : ""
                } cursor-pointer p-2 rounded-[8px]`}>
                <TableProperties size={16} strokeWidth={1} />
              </span>
            </TooltipTrigger>
            <TooltipContent className="bg-white-900">
              <p>Show Table</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                onClick={chartHandler}
                className={`${
                  showCharts ? "bg-blue-400 " : ""
                } cursor-pointer p-2 rounded-[8px]`}>
                <BarChart4 size={16} strokeWidth={1} />
              </span>
            </TooltipTrigger>
            <TooltipContent className="bg-white-900">
              <p>Show Chart</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {showCharts ? (
        <div className="bg-white-900 rounded-[12px] h-full">
          <div className={`chartsWrap`}>
            <Charts
              dailyUsageData={dailyUsageData}
              responseTimeData={responseTimeData}
              avgRespTime={avgRespTime}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="max-w-[300px] w-full mb-4">
            <InputField
              placeholder="Filter Name and Email..."
              value={
                ((
                  table.getColumn("name") && table.getColumn("email")
                )?.getFilterValue() as string) ?? ""
              }
              onChange={(event: any) =>
                (
                  table.getColumn("name") && table.getColumn("email")
                )?.setFilterValue(event.target.value)
              }
              className="max-w-[300px] h-[44px] !mt-0"
              type={"text"}
            />
          </div>
          <div className="rounded-[12px] border border-[#D0E0FB]">
            <Table className="customTable">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-b-[#D0E0FB]">
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="">
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
                      className="border-b-[#D0E0FB]">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center">
                      <div className="flex-col gap-4 w-full flex items-center justify-center">
                        <div className="w-22 h-22 border-8 text-blue-400 text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-blue-400 rounded-full">
                          <Image
                            src={logoSmall}
                            alt="logo"
                            width={26}
                            height={26}
                            className="animate-ping"
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="flex items-center justify-end space-x-2 py-4 border-t border-[#D0E0FB]">
              {/* <div className="text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </div> */}
              <>
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
              </>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HrTable;
