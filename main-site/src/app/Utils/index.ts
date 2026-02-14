
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

class Helper {


    handleGetUserFromLocal = () => {
        const user = localStorage.getItem("user-detail");
        if (user) {
            const parsedUser = JSON.parse(user);
            return parsedUser;
        }

        return null;
    }

    pad2 = (n: number) => String(n).padStart(2, "0");

    formatTime = (date: Date) =>
        `${this.pad2(date.getHours())}:${this.pad2(date.getMinutes())}`;


    formatRelativeTime(dateString: string, nowMs: number): string {
        const date = new Date(dateString);
        const now = new Date(nowMs);
    
        const diffMs = now.getTime() - date.getTime();
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
    
        if (diffSec < 60) return `${diffSec} sec ago`;
    
        if (diffMin < 60) return `${diffMin} min ago`;
    
        if (diffHour < 24)
            return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
    
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const inputDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
        const dayDiff = Math.floor(
            (today.getTime() - inputDay.getTime()) / (1000 * 60 * 60 * 24)
        );
    
        if (dayDiff === 1)
            return `Yesterday ${this.formatTime(date)}`;
    
        if (dayDiff < 7)
            return `${DAYS[date.getDay()]} ${this.formatTime(date)}`;
    
        if (dayDiff < 14)
            return `Last ${DAYS[date.getDay()]} ${this.formatTime(date)}`;
    
        if (date.getFullYear() === now.getFullYear())
            return `${MONTHS[date.getMonth()]} ${date.getDate()} ${this.formatTime(date)}`;
    
        return `${MONTHS[date.getMonth()]} ${date.getDate()} ${date.getFullYear()} ${this.formatTime(date)}`;
    }
    

   


}

const helper = new Helper();
export { helper }