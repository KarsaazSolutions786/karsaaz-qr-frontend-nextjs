import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCode, qrCodeService } from "@/services/qr.service";
import {
    BarChart2,
    Calendar,
    ChevronLeft,
    Cpu,
    Download,
    Globe,
    Monitor,
    QrCode,
    Smartphone
} from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState, useCallback } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import { toast } from "sonner";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface DailyScan {
    date: string;
    scans: number;
}

interface CountryScan {
    country: string;
    scans: number;
}

interface OsScan {
    os: string;
    scans: number;
}

interface BrowserScan {
    browser: string;
    scans: number;
}

interface DeviceScan {
    brand: string;
    scans: number;
}

export default function QRStatsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [qrcode, setQrcode] = useState<QRCode | null>(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, _setDateRange] = useState({ from: "", to: "" }); // Changed setDateRange to _setDateRange as it's not directly used for update

    // Report data states
    const [dailyScans, setDailyScans] = useState<DailyScan[]>([]);
    const [countries, setCountries] = useState<CountryScan[]>([]);
    const [osData, setOsData] = useState<OsScan[]>([]);
    const [browserData, setBrowserData] = useState<BrowserScan[]>([]);
    const [deviceData, setDeviceData] = useState<DeviceScan[]>([]);

    const fetchInitialData = useCallback(async () => {
        try {
            const data = await qrCodeService.getOne(id);
            setQrcode(data);
        } catch (error: unknown) {
            console.error("Failed to fetch QR code", error);
            toast.error("Failed to load QR code details");
        }
    }, [id]);

    const fetchReports = useCallback(async () => {
        setLoading(true);
        try {
            const [daily, country, os, browser, device] = await Promise.all([
                qrCodeService.getReport(id, "scans-per-day", dateRange),
                qrCodeService.getReport(id, "scans-per-country", dateRange),
                qrCodeService.getReport(id, "scans-per-os", dateRange),
                qrCodeService.getReport(id, "scans-per-browser", dateRange),
                qrCodeService.getReport(id, "scans-per-device-brand", dateRange),
            ]);

            setDailyScans(daily.map((item: DailyScan) => ({ name: item.date, scans: item.scans })));
            setCountries(country.map((item: CountryScan) => ({ name: item.country || "Unknown", value: item.scans })));
            setOsData(os.map((item: OsScan) => ({ name: item.os || "Unknown", scans: item.scans })));
            setBrowserData(browser.map((item: BrowserScan) => ({ name: item.browser || "Unknown", scans: item.scans })));
            setDeviceData(device.map((item: DeviceScan) => ({ name: item.brand || "Unknown", scans: item.scans })));

        } catch (error: unknown) {
            console.error("Failed to fetch reports", error);
        } finally {
            setLoading(false);
        }
    }, [id, dateRange]);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    useEffect(() => {
        if (id) fetchReports();
    }, [id, dateRange, fetchReports]);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/qrcodes">
                        <Button variant="outline" size="icon">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <BarChart2 className="h-6 w-6 text-blue-600" />
                            QR Code Statistics
                        </h1>
                        <p className="text-muted-foreground">
                            Deep analytics for {qrcode?.name || "your QR code"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => window.print()}>
                        <Download className="mr-2 h-4 w-4" />
                        Export PDF
                    </Button>
                    <Button>
                        <Calendar className="mr-2 h-4 w-4" />
                        Select Range
                    </Button>
                </div>
            </div>

            {qrcode && (
                <Card className="bg-muted/30 border-none shadow-none">
                    <CardContent className="flex flex-col sm:flex-row items-center gap-6 p-6">
                        <div className="h-24 w-24 bg-white border rounded flex items-center justify-center p-2">
                            {qrcode.simple_png_url ? (
                                <img src={qrcode.simple_png_url} alt="QR" className="h-full w-full object-contain" />
                            ) : (
                                <QrCode className="h-12 w-12 text-gray-300" />
                            )}
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <h3 className="text-lg font-bold">{qrcode.name}</h3>
                            <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-1">
                                <Badge variant="secondary">{qrcode.type}</Badge>
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Globe className="h-3 w-3" />
                                    {qrcode.short_url}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold">{qrcode.scans_count || 0}</div>
                                <div className="text-[10px] uppercase text-muted-foreground font-bold">Total Scans</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Main Charts Row */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-3">
                    <CardHeader>
                        <CardTitle>Daily Scans</CardTitle>
                        <CardDescription>Number of scans over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            {loading ? (
                                <div className="h-full w-full flex items-center justify-center bg-muted/20 animate-pulse rounded" />
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={dailyScans}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="scans"
                                            stroke="#2563eb"
                                            strokeWidth={2}
                                            dot={{ r: 4, fill: "#2563eb" }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2 font-bold">
                            <Globe className="h-4 w-4" /> Scans by Country
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] w-full">
                            {loading ? (
                                <div className="h-full w-full flex items-center justify-center bg-muted/20 animate-pulse rounded" />
                            ) : countries.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={countries}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {countries.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-muted-foreground text-sm italic">No data</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2 font-bold">
                            <Cpu className="h-4 w-4" /> Operating Systems
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] w-full">
                            {loading ? (
                                <div className="h-full w-full flex items-center justify-center bg-muted/20 animate-pulse rounded" />
                            ) : osData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={osData} layout="vertical">
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" fontSize={12} width={80} />
                                        <Tooltip />
                                        <Bar dataKey="scans" fill="#8884d8" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-muted-foreground text-sm italic">No data</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2 font-bold">
                            <Monitor className="h-4 w-4" /> Browser Usage
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] w-full">
                            {loading ? (
                                <div className="h-full w-full flex items-center justify-center bg-muted/20 animate-pulse rounded" />
                            ) : browserData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={browserData} layout="vertical">
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" fontSize={12} width={80} />
                                        <Tooltip />
                                        <Bar dataKey="scans" fill="#82ca9d" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-muted-foreground text-sm italic">No data</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2 font-bold">
                            <Smartphone className="h-4 w-4" /> Device Brands
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] w-full">
                            {loading ? (
                                <div className="h-full w-full flex items-center justify-center bg-muted/20 animate-pulse rounded" />
                            ) : deviceData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={deviceData}>
                                        <XAxis dataKey="name" fontSize={12} />
                                        <YAxis fontSize={12} />
                                        <Tooltip />
                                        <Bar dataKey="scans" fill="#FFBB28" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-muted-foreground text-sm italic">No data</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex flex-col justify-center items-center p-12 text-center bg-blue-600 text-white">
                    <h3 className="text-2xl font-bold mb-2">Power up your data</h3>
                    <p className="mb-6 opacity-90 max-w-sm">Get more insights with our Advanced Analytics add-on. Track exact geolocation and session duration.</p>
                    <Button variant="secondary">Upgrade Now</Button>
                </Card>
            </div>
        </div>
    );
}
