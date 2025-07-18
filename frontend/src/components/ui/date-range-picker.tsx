"use client"

import * as React from "react"
import { format } from "date-fns"
import { id } from "date-fns/locale" // Import locale Bahasa Indonesia
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface CalendarDateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
    date: DateRange | undefined;
    onDateChange: (date: DateRange | undefined) => void;
}

export function CalendarDateRangePicker({
    className,
    date,
    onDateChange
}: CalendarDateRangePickerProps) {

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[260px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "d LLL, y", { locale: id })} -{" "}
                                    {format(date.to, "d LLL, y", { locale: id })}
                                </>
                            ) : (
                                format(date.from, "d LLL, y", { locale: id })
                            )
                        ) : (
                            <span>Pilih tanggal</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                        initialFocus
                        mode="range" // Mode penting untuk memilih rentang
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={onDateChange}
                        numberOfMonths={2} // Menampilkan 2 bulan sekaligus
                        locale={id} // Gunakan locale Indonesia
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}