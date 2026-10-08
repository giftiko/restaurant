import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Flame, 
  Sparkles, 
  ChefHat, 
  UtensilsCrossed, 
  Bell, 
  Wine, 
  Printer, 
  FastForward, 
  RotateCcw
} from 'lucide-react';
import { Order, OrderStage } from '../types/menu';

interface OrderTrackerProps {
  orders: Order[];
  activeOrderId: string;
  setActiveOrderId: (id: string) => void;
  onAdvanceOrderStage: (orderId: string) => void;
  onResetOrder: (orderId: string) => void;
  onReturnToMenu: () => void;
  simSpeed: number;
  setSimSpeed: (speed: number) => void;
}

const STAGES_CONFIG: {
  key: OrderStage;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    key: 'received',
    label: 'Order Ticket Confirmed',
    sublabel: 'Kitchen expo logged ticket',
    icon: Bell,
  },
  {
    key: 'mise_en_place',
    label: 'Mise en Place & Prep',
    sublabel: 'Butcher tempering cuts & herbs',
    icon: ChefHat,
  },
  {
    key: 'wood_fired_hearth',
    label: 'Wood-Fired Hearth & Range',
    sublabel: '840°F White Oak ember cooking',
    icon: Flame,
  },
  {
    key: 'plating_qc',
    label: 'Plating & Quality Pass',
    sublabel: 'Executive chef inspection & drizzle',
    icon: Sparkles,
  },
  {
    key: 'ready_for_service',
    label: 'En Route to Table',
    sublabel: 'Server dispatch in progress',
    icon: UtensilsCrossed,
  },
  {
    key: 'completed',
    label: 'Served & Enjoyed',
    sublabel: 'Culinary experience fulfilled',
    icon: CheckCircle2,
  },
];

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  orders,
  activeOrderId,
  setActiveOrderId,
  onAdvanceOrderStage,
  onResetOrder,
  onReturnToMenu,
  simSpeed,
  setSimSpeed,
}) => {
  const [serverCalled, setServerCalled] = useState(false);
  const [sommelierCalled, setSommelierCalled] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const activeOrder = orders.find((o) => o.id === activeOrderId) || orders[0];

  if (!activeOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <Flame className="w-10 h-10 text-[#9e5a2a] mx-auto stroke-1" />
        <h2 className="font-serif-display text-2xl text-[#181716]">No Active Kitchen Orders</h2>
        <p className="text-xs text-[#7a7267]">Select courses from our menu to initiate a live hearth ticket.</p>
        <button
          onClick={onReturnToMenu}
          className="px-5 py-2.5 bg-[#181716] text-[#ffffff] font-medium text-xs rounded cursor-pointer"
        >
          Explore Seasonal Menu
        </button>
      </div>
    );
  }

  const currentStageIndex = STAGES_CONFIG.findIndex((s) => s.key === activeOrder.stage);
  const progressPercent = Math.min(100, Math.round(((currentStageIndex + 1) / STAGES_CONFIG.length) * 100));

  const formatTimeRemaining = (seconds: number) => {
    if (activeOrder.stage === 'completed') return 'Order Completed';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const handleCallServer = () => {
    setServerCalled(true);
    setTimeout(() => setServerCalled(false), 4000);
  };

  const handleCallSommelier = () => {
    setSommelierCalled(true);
    setTimeout(() => setSommelierCalled(false), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in text-[#181716]">
      {/* Toast notifications */}
      {serverCalled && (
        <div className="fixed top-24 right-6 z-50 bg-[#ffffff] border border-[#9e5a2a] text-[#181716] px-4 py-3 rounded shadow-lg flex items-center gap-3 text-xs animate-slide-in">
          <CheckCircle2 className="w-4 h-4 text-[#9e5a2a]" />
          <span>Server dispatched to {activeOrder.tableNumber || 'your table'}. Arriving shortly.</span>
        </div>
      )}

      {sommelierCalled && (
        <div className="fixed top-24 right-6 z-50 bg-[#ffffff] border border-[#9e5a2a] text-[#181716] px-4 py-3 rounded shadow-lg flex items-center gap-3 text-xs animate-slide-in">
          <Wine className="w-4 h-4 text-[#9e5a2a]" />
          <span>Head Sommelier notified for cellar consultation at your table.</span>
        </div>
      )}

      {/* Top Banner / Breadcrumb & Multi-Order Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e8e3d8]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#7a7267] mb-1">
            <button onClick={onReturnToMenu} className="hover:text-[#181716] transition-colors cursor-pointer">
              Menu
            </button>
            <span>/</span>
            <span className="text-[#9e5a2a] font-medium">Live Hearth Tracking</span>
          </div>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-medium text-[#181716]">
            Live Kitchen Order Status
          </h1>
        </div>

        {/* Order Selector pills if multiple orders */}
        {orders.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-[#ffffff] border border-[#ded8cc] rounded shadow-2xs">
            {orders.map((ord) => (
              <button
                key={ord.id}
                onClick={() => setActiveOrderId(ord.id)}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-colors cursor-pointer ${
                  ord.id === activeOrderId
                    ? 'bg-[#181716] text-[#ffffff]'
                    : 'text-[#665e54] hover:text-[#181716]'
                }`}
              >
                #{ord.orderNumber} ({ord.diningType})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Order Status Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Big Progress Card & Timeline (Col Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Status Hero Card */}
          <div className="p-6 sm:p-7 bg-[#ffffff] border border-[#e8e3d8] rounded-lg space-y-6 shadow-xs relative overflow-hidden">
            {/* Background ambient hearth glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#e2b07e]/12 blur-3xl pointer-events-none rounded-full" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs tracking-wider text-[#9e5a2a] uppercase font-bold">
                    Order Ticket #{activeOrder.orderNumber}
                  </span>
                  <span className="text-xs text-[#ded8cc]">·</span>
                  <span className="text-xs text-[#7a7267] font-medium">{activeOrder.diningType}</span>
                  {activeOrder.tableNumber && (
                    <>
                      <span className="text-xs text-[#ded8cc]">·</span>
                      <span className="text-xs font-medium text-[#181716]">{activeOrder.tableNumber}</span>
                    </>
                  )}
                </div>
                <h2 className="font-serif-display text-xl sm:text-2xl font-medium text-[#181716]">
                  {STAGES_CONFIG[currentStageIndex]?.label || 'Preparing Dishes'}
                </h2>
                <p className="text-xs text-[#665e54]">
                  {STAGES_CONFIG[currentStageIndex]?.sublabel}
                </p>
              </div>

              {/* Countdown Timer Block */}
              <div className="p-4 bg-[#fbf9f6] border border-[#ded8cc] rounded text-center sm:text-right shrink-0 shadow-2xs">
                <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-[#7a7267] mb-1 justify-center sm:justify-end font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#9e5a2a]" />
                  <span>Estimated Arrival</span>
                </div>
                <div className="font-mono text-2xl font-semibold text-[#181716] tabular-nums">
                  {formatTimeRemaining(activeOrder.estimatedRemainingSeconds)}
                </div>
                <div className="text-[10px] text-[#8a8174] mt-0.5 font-sans-body">
                  Real-time kitchen countdown
                </div>
              </div>
            </div>

            {/* Continuous Progress Bar */}
            <div className="space-y-2 relative z-10">
              <div className="flex justify-between text-xs font-mono text-[#7a7267]">
                <span>Progress: {progressPercent}%</span>
                <span>Stage {currentStageIndex + 1} of 6</span>
              </div>
              <div className="w-full h-2 bg-[#ede7dc] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#9e5a2a] via-[#b37e4c] to-[#9e5a2a] transition-all duration-700 ease-out rounded-full shadow-xs"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Stepper Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-2 relative z-10">
              {STAGES_CONFIG.map((stage, idx) => {
                const IconComponent = stage.icon;
                const isPassed = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                return (
                  <div
                    key={stage.key}
                    className={`p-3 rounded border flex flex-col items-center text-center transition-all ${
                      isCurrent
                        ? 'bg-[#f4ede3] border-[#9e5a2a] text-[#181716] shadow-xs'
                        : isPassed
                        ? 'bg-[#faf8f5] border-[#ded8cc] text-[#665e54]'
                        : 'bg-[#ffffff] border-[#ece6dc] text-[#a89f92] opacity-75'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center mb-2 ${
                        isCurrent
                          ? 'bg-[#9e5a2a] text-[#ffffff]'
                          : isPassed
                          ? 'bg-[#ede5d8] text-[#9e5a2a]'
                          : 'bg-[#f5f1ea] text-[#9e9589]'
                      }`}
                    >
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-medium leading-tight line-clamp-2">
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Live Kitchen Telemetry Bar */}
            <div className="p-4 bg-[#fbf9f6] border border-[#ded8cc] rounded grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase tracking-[0.16em] text-[#7a7267] font-medium">Kitchen Station</span>
                <p className="font-medium text-[#181716]">{activeOrder.stationName}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase tracking-[0.16em] text-[#7a7267] font-medium">Hearth Heat / Temp</span>
                <p className="font-mono text-[#9e5a2a] font-medium">{activeOrder.stationTemp}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase tracking-[0.16em] text-[#7a7267] font-medium">Station Lead</span>
                <p className="font-medium text-[#181716]">{activeOrder.stationChef}</p>
              </div>
            </div>

            {/* Simulation Testing Control Ribbon */}
            <div className="pt-3 border-t border-[#f0ebe2] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-[#7a7267]">
                <span className="text-[11px] uppercase tracking-[0.16em] font-medium">Simulator Speed:</span>
                {[
                  { speed: 1, label: '1x' },
                  { speed: 5, label: '5x' },
                  { speed: 10, label: '10x' },
                ].map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setSimSpeed(s.speed)}
                    className={`px-2.5 py-1 font-mono text-[11px] rounded transition-colors cursor-pointer border ${
                      simSpeed === s.speed
                        ? 'bg-[#181716] text-[#ffffff] font-bold border-[#181716]'
                        : 'bg-[#faf8f5] text-[#665e54] border-[#ded8cc] hover:bg-[#ede7dc]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onAdvanceOrderStage(activeOrder.id)}
                  className="px-3 py-1.5 bg-[#ede5d8] hover:bg-[#e4dcce] border border-[#ded8cc] text-[#181716] rounded transition-colors flex items-center gap-1.5 cursor-pointer text-xs font-medium"
                >
                  <FastForward className="w-3.5 h-3.5 text-[#9e5a2a]" />
                  <span>Next Stage</span>
                </button>
                <button
                  onClick={() => onResetOrder(activeOrder.id)}
                  className="px-2.5 py-1.5 bg-[#faf8f5] hover:bg-[#ede7dc] border border-[#ded8cc] text-[#665e54] hover:text-[#181716] rounded transition-colors cursor-pointer text-xs"
                  title="Reset status simulation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Kitchen Event Feed / Activity Log */}
          <div className="p-6 bg-[#ffffff] border border-[#e8e3d8] rounded-lg space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-display text-base font-medium text-[#181716]">
                Chronological Hearth Activity Log
              </h3>
              <span className="text-[11px] text-[#7a7267] font-mono">
                {activeOrder.logs.length} logged events
              </span>
            </div>

            <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-px before:bg-[#e8e3d8]">
              {activeOrder.logs.map((log) => (
                <div key={log.id} className="relative pl-7 space-y-1">
                  <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-[#ffffff] border-2 border-[#9e5a2a]" />
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif-display text-xs font-semibold text-[#181716]">
                      {log.title}
                    </span>
                    <span className="font-mono text-[10px] text-[#8a8174] tabular-nums">
                      {log.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-[#524a40]">{log.detail}</p>
                  <div className="text-[10px] text-[#8a8174] uppercase tracking-wider font-medium">
                    Station: {log.station}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Ticket, Service Actions & Receipt (Col Span 1) */}
        <div className="space-y-6">
          {/* Quick Hospitality Actions */}
          <div className="p-5 bg-[#ffffff] border border-[#e8e3d8] rounded-lg space-y-3 shadow-xs">
            <h3 className="font-serif-display text-sm font-medium text-[#181716]">
              Table Hospitality Services
            </h3>
            <p className="text-xs text-[#665e54]">
              Instant communication with your dedicated hearth service team.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleCallServer}
                className="py-2.5 px-3 bg-[#faf8f5] hover:bg-[#ede7dc] border border-[#ded8cc] text-[#181716] rounded text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5 text-[#9e5a2a]" />
                <span>Call Server</span>
              </button>

              <button
                onClick={handleCallSommelier}
                className="py-2.5 px-3 bg-[#faf8f5] hover:bg-[#ede7dc] border border-[#ded8cc] text-[#181716] rounded text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Wine className="w-3.5 h-3.5 text-[#9e5a2a]" />
                <span>Sommelier</span>
              </button>
            </div>

            <button
              onClick={() => setShowReceipt(true)}
              className="w-full py-2.5 px-3 bg-[#faf8f5] hover:bg-[#ede7dc] border border-[#ded8cc] text-[#443e37] hover:text-[#181716] rounded text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>View & Print Itemized Bill</span>
            </button>
          </div>

          {/* Itemized Order Dishes Card */}
          <div className="p-5 bg-[#ffffff] border border-[#e8e3d8] rounded-lg space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#f0ebe2]">
              <span className="font-serif-display text-sm font-medium text-[#181716]">
                Courses in this Fire
              </span>
              <span className="text-xs font-mono text-[#7a7267]">
                {activeOrder.items.reduce((s, i) => s + i.quantity, 0)} courses
              </span>
            </div>

            <div className="space-y-3">
              {activeOrder.items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="p-3 bg-[#faf8f5] border border-[#e8e3d8] rounded space-y-1.5"
                >
                  <div className="flex justify-between items-start text-xs font-medium text-[#181716]">
                    <span>
                      {item.quantity}x {item.menuItem.name}
                    </span>
                    <span className="font-mono tabular-nums text-[#9e5a2a] font-medium">
                      ${item.itemTotalPrice.toFixed(2)}
                    </span>
                  </div>

                  {item.options && (
                    <div className="text-[11px] text-[#7a7267] space-y-0.5">
                      {item.options.doneness && (
                        <div>Doneness: {item.options.doneness}</div>
                      )}
                      {item.options.selectedAddOns?.map((a) => (
                        <div key={a.name}>+ {a.name}</div>
                      ))}
                      {item.options.specialInstructions && (
                        <div className="italic text-[#8a8174]">
                          "{item.options.specialInstructions}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="pt-3 border-t border-[#f0ebe2] space-y-1 text-xs text-[#665e54]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-[#181716]">
                  ${activeOrder.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax & Service Charge</span>
                <span className="font-mono tabular-nums text-[#181716]">
                  ${(activeOrder.tax + activeOrder.serviceFee).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Staff Gratuity</span>
                <span className="font-mono tabular-nums text-[#181716]">
                  ${activeOrder.tip.toFixed(2)}
                </span>
              </div>
              <div className="pt-2 border-t border-[#e8e3d8] flex justify-between font-semibold text-sm text-[#181716]">
                <span>Total Paid</span>
                <span className="font-mono text-base text-[#9e5a2a] tabular-nums font-bold">
                  ${activeOrder.total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={onReturnToMenu}
              className="w-full py-2.5 bg-[#f5f1ea] hover:bg-[#eae4d9] text-[#181716] text-xs font-medium rounded transition-colors cursor-pointer"
            >
              Order Additional Courses
            </button>
          </div>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      {showReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-[#ffffff] border border-[#ded8cc] rounded p-6 space-y-5 text-[#181716] shadow-2xl">
            <div className="text-center space-y-1 pb-4 border-b border-[#f0ebe2]">
              <h2 className="font-serif-display text-xl text-[#181716]">L'Atelier Hearth</h2>
              <div className="text-[10px] text-[#7a7267] uppercase tracking-[0.2em] font-medium">
                Artisanal Kitchen & Ember Bar
              </div>
              <div className="text-xs text-[#8a8174] font-mono">
                Ticket #{activeOrder.orderNumber} · {activeOrder.diningType} · {activeOrder.tableNumber}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              {activeOrder.items.map((i) => (
                <div key={i.cartItemId} className="flex justify-between">
                  <span>{i.quantity}x {i.menuItem.name}</span>
                  <span className="font-mono">${i.itemTotalPrice.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#f0ebe2] space-y-1 text-xs text-[#665e54]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono">${activeOrder.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Hospitality Tax & Maintenance</span>
                <span className="font-mono">${(activeOrder.tax + activeOrder.serviceFee).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Staff Gratuity</span>
                <span className="font-mono">${activeOrder.tip.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-[#e8e3d8] flex justify-between font-bold text-sm text-[#181716]">
                <span>Total Amount</span>
                <span className="font-mono text-[#9e5a2a]">${activeOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2 text-center text-[10px] text-[#8a8174]">
              Thank you for dining with L'Atelier Hearth. Bon Appétit.
            </div>

            <button
              onClick={() => setShowReceipt(false)}
              className="w-full py-2.5 bg-[#181716] hover:bg-[#2c2927] text-[#ffffff] rounded text-xs font-medium cursor-pointer"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
