from enum import Enum


class ModuleType(str, Enum):
    AUTH = "auth"
    USER = "user"
    ROLE = "role"
    CORE = "core"
    DASHBOARD = "dashboard"
    EMPLOYEE = "employee"
    DEPARTMENT = "department"
    ATTENDANCE = "attendance"
    LEAVE = "leave"
    PAYROLL = "payroll"
    RECRUITMENT = "recruitment"
    PERFORMANCE = "performance"
    ASSET = "asset"
    PRODUCT = "product"
    INVENTORY = "inventory"
    WAREHOUSE = "warehouse"
    STOCK_TRANSFER = "stock_transfer"
    PURCHASE = "purchase"
    SUPPLIER = "supplier"
    SALES = "sales"
    CUSTOMER = "customer"
    CRM = "crm"
    INVOICING = "invoicing"
    ACCOUNTING = "accounting"
    FINANCE = "finance"
    BANK = "bank"
    TAX = "tax"
    PROJECT = "project"
    TASK = "task"
    CALENDAR = "calendar"
    MESSAGING = "messaging"
    NOTIFICATION = "notification"
    DOCUMENT = "document"
    REPORT = "report"
    SETTINGS = "settings"
    AUDIT = "audit"
    API_GATEWAY = "api_gateway"
    WORKFLOW = "workflow"
    EMAIL_TEMPLATE = "email_template"
    SMS_TEMPLATE = "sms_template"
    BACKUP = "backup"
    MONITORING = "monitoring"
    ACTIVITY = "activity"
    INTEGRATION = "integration"
    LOCALIZATION = "localization"
    AI = "ai"


class ActionType(str, Enum):
    CREATE = "create"
    READ = "read"
    UPDATE = "update"
    DELETE = "delete"
    APPROVE = "approve"
    REJECT = "reject"
    SUBMIT = "submit"
    CANCEL = "cancel"
    IMPORT = "import"
    EXPORT = "export"
    ARCHIVE = "archive"
    RESTORE = "restore"


class EntityStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    DRAFT = "draft"
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    CANCELLED = "cancelled"
    ARCHIVED = "archived"
    DELETED = "deleted"
    SUSPENDED = "suspended"
    LOCKED = "locked"
    CLOSED = "closed"
    COMPLETED = "completed"
    FAILED = "failed"


class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"
    PREFER_NOT_TO_SAY = "prefer_not_to_say"


class MaritalStatus(str, Enum):
    SINGLE = "single"
    MARRIED = "married"
    DIVORCED = "divorced"
    WIDOWED = "widowed"


class EmployeeStatus(str, Enum):
    ACTIVE = "active"
    PROBATION = "probation"
    SUSPENDED = "suspended"
    TERMINATED = "terminated"
    RESIGNED = "resigned"
    RETIRED = "retired"
    ON_LEAVE = "on_leave"


class LeaveType(str, Enum):
    ANNUAL = "annual"
    SICK = "sick"
    PERSONAL = "personal"
    MATERNITY = "maternity"
    PATERNITY = "paternity"
    BEREAVEMENT = "bereavement"
    UNPAID = "unpaid"
    COMPENSATORY = "compensatory"
    STUDY = "study"
    SABBATICAL = "sabbatical"


class LeaveStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    CANCELLED = "cancelled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class AttendanceMethod(str, Enum):
    BIOMETRIC = "biometric"
    CARD = "card"
    MOBILE = "mobile"
    WEB = "web"
    MANUAL = "manual"
    GEO_FENCE = "geo_fence"


class PayrollStatus(str, Enum):
    DRAFT = "draft"
    PROCESSING = "processing"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    APPROVED = "approved"
    PAID = "paid"


class ProductType(str, Enum):
    GOODS = "goods"
    SERVICE = "service"
    DIGITAL = "digital"
    BUNDLE = "bundle"
    RAW_MATERIAL = "raw_material"
    SEMI_FINISHED = "semi_finished"
    FINISHED = "finished"


class UnitType(str, Enum):
    PIECE = "piece"
    KG = "kg"
    G = "g"
    L = "l"
    ML = "ml"
    M = "m"
    M2 = "m2"
    M3 = "m3"
    BOX = "box"
    PACK = "pack"
    SET = "set"
    HOUR = "hour"
    DAY = "day"
    MONTH = "month"


class WarehouseType(str, Enum):
    PHYSICAL = "physical"
    VIRTUAL = "virtual"
    TRANSIT = "transit"
    CONSOLIDATION = "consolidation"
    CROSS_DOCK = "cross_dock"


class StockMovementType(str, Enum):
    RECEIPT = "receipt"
    ISSUE = "issue"
    TRANSFER_IN = "transfer_in"
    TRANSFER_OUT = "transfer_out"
    ADJUSTMENT = "adjustment"
    COUNT = "count"
    RETURN = "return"
    WRITE_OFF = "write_off"
    RESERVATION = "reservation"
    UNRESERVATION = "unreservation"


class PurchaseOrderStatus(str, Enum):
    DRAFT = "draft"
    PENDING_APPROVAL = "pending_approval"
    APPROVED = "approved"
    SENT = "sent"
    CONFIRMED = "confirmed"
    PARTIALLY_RECEIVED = "partially_received"
    FULLY_RECEIVED = "fully_received"
    CANCELLED = "cancelled"
    CLOSED = "closed"


class SalesOrderStatus(str, Enum):
    DRAFT = "draft"
    PENDING_APPROVAL = "pending_approval"
    APPROVED = "approved"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    PARTIALLY_SHIPPED = "partially_shipped"
    FULLY_SHIPPED = "fully_shipped"
    PARTIALLY_INVOICED = "partially_invoiced"
    FULLY_INVOICED = "fully_invoiced"
    CANCELLED = "cancelled"
    CLOSED = "closed"


class InvoiceDirection(str, Enum):
    AR = "ar"
    AP = "ap"


class InvoiceType(str, Enum):
    STANDARD = "standard"
    CREDIT = "credit"
    DEBIT = "debit"
    PROFORMA = "proforma"
    E_INVOICE = "e_invoice"
    E_ARCHIVE = "e_archive"


class InvoiceStatus(str, Enum):
    DRAFT = "draft"
    SENT = "sent"
    PARTIALLY_PAID = "partially_paid"
    FULLY_PAID = "fully_paid"
    OVERDUE = "overdue"
    CANCELLED = "cancelled"
    CREDITED = "credited"
    DISPUTED = "disputed"


class AccountType(str, Enum):
    ASSET = "asset"
    LIABILITY = "liability"
    EQUITY = "equity"
    REVENUE = "revenue"
    EXPENSE = "expense"
    CONTRA_ASSET = "contra_asset"
    CONTRA_LIABILITY = "contra_liability"
    CONTRA_EQUITY = "contra_equity"
    CONTRA_REVENUE = "contra_revenue"
    CONTRA_EXPENSE = "contra_expense"


class JournalType(str, Enum):
    GENERAL = "general"
    SALES = "sales"
    PURCHASE = "purchase"
    CASH_RECEIPT = "cash_receipt"
    CASH_DISBURSEMENT = "cash_disbursement"
    PAYROLL = "payroll"
    ADJUSTMENT = "adjustment"
    CLOSING = "closing"
    REVERSAL = "reversal"


class TaxType(str, Enum):
    VAT = "vat"
    GST = "gst"
    SALES_TAX = "sales_tax"
    WITHHOLDING = "withholding"
    EXCISE = "excise"
    CUSTOMS = "customs"
    STAMP = "stamp"
    CONSUMPTION = "consumption"


class PaymentMethod(str, Enum):
    CASH = "cash"
    BANK_TRANSFER = "bank_transfer"
    CREDIT_CARD = "credit_card"
    DEBIT_CARD = "debit_card"
    CHECK = "check"
    E_WALLET = "e_wallet"
    WIRE_TRANSFER = "wire_transfer"
    DIRECT_DEPOSIT = "direct_deposit"


class PaymentStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"
    PARTIALLY_REFUNDED = "partially_refunded"
    CANCELLED = "cancelled"


class ProjectStatus(str, Enum):
    PLANNING = "planning"
    IN_PROGRESS = "in_progress"
    ON_HOLD = "on_hold"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    ARCHIVED = "archived"


class TaskStatus(str, Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    IN_REVIEW = "in_review"
    DONE = "done"
    BLOCKED = "blocked"
    CANCELLED = "cancelled"


class TaskPriority(str, Enum):
    LOWEST = "lowest"
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    HIGHEST = "highest"
    CRITICAL = "critical"


class NotificationChannel(str, Enum):
    EMAIL = "email"
    SMS = "sms"
    PUSH = "push"
    IN_APP = "in_app"
    WEBHOOK = "webhook"
    SLACK = "slack"
    TEAMS = "teams"


class NotificationType(str, Enum):
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    SUCCESS = "success"
    APPROVAL_REQUEST = "approval_request"
    APPROVAL_RESPONSE = "approval_response"
    TASK_ASSIGNMENT = "task_assignment"
    LEAVE_REQUEST = "leave_request"
    PAYSLIP_READY = "payslip_ready"
    SYSTEM_ALERT = "system_alert"


class AuditEventType(str, Enum):
    CREATE = "create"
    UPDATE = "update"
    DELETE = "delete"
    LOGIN = "login"
    LOGOUT = "logout"
    PASSWORD_CHANGE = "password_change"
    ROLE_CHANGE = "role_change"
    PERMISSION_CHANGE = "permission_change"
    EXPORT = "export"
    IMPORT = "import"
    APPROVE = "approve"
    REJECT = "reject"
    SYSTEM_CONFIG_CHANGE = "system_config_change"
    API_KEY_GENERATED = "api_key_generated"
    FAILED_LOGIN = "failed_login"
    MFA_ENABLED = "mfa_enabled"
    MFA_DISABLED = "mfa_disabled"


class WorkflowTriggerType(str, Enum):
    EVENT = "event"
    SCHEDULE = "schedule"
    WEBHOOK = "webhook"
    MANUAL = "manual"
    CONDITION = "condition"


class IntegrationType(str, Enum):
    REST = "rest"
    SOAP = "soap"
    GRAPHQL = "graphql"
    WEBHOOK = "webhook"
    FTP = "ftp"
    SFTP = "sftp"
    DATABASE = "database"
    MESSAGE_QUEUE = "message_queue"


class Language(str, Enum):
    EN = "en"
    TR = "tr"
    DE = "de"
    FR = "fr"
    ES = "es"
    IT = "it"
    PT = "pt"
    RU = "ru"
    AR = "ar"
    ZH = "zh"
    JA = "ja"
    KO = "ko"


class Currency(str, Enum):
    USD = "USD"
    EUR = "EUR"
    TRY = "TRY"
    GBP = "GBP"
    CHF = "CHF"
    JPY = "JPY"
    CNY = "CNY"
    RUB = "RUB"
    CAD = "CAD"
    AUD = "AUD"
    BRL = "BRL"
    INR = "INR"


class Timezone(str, Enum):
    UTC = "UTC"
    US_EASTERN = "US/Eastern"
    US_CENTRAL = "US/Central"
    US_MOUNTAIN = "US/Mountain"
    US_PACIFIC = "US/Pacific"
    EUROPE_LONDON = "Europe/London"
    EUROPE_BERLIN = "Europe/Berlin"
    EUROPE_ISTANBUL = "Europe/Istanbul"
    EUROPE_PARIS = "Europe/Paris"
    ASIA_DUBAI = "Asia/Dubai"
    ASIA_TOKYO = "Asia/Tokyo"
    ASIA_SHANGHAI = "Asia/Shanghai"
    ASIA_SINGAPORE = "Asia/Singapore"
    AUSTRALIA_SYDNEY = "Australia/Sydney"


class ReportFormat(str, Enum):
    PDF = "pdf"
    XLSX = "xlsx"
    CSV = "csv"
    HTML = "html"
    JSON = "json"
    XML = "xml"


class ExportStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    EXPIRED = "expired"


class EventStatus(str, Enum):
    SCHEDULED = "scheduled"
    ONGOING = "ongoing"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    POSTPONED = "postponed"


class DocReferenceType(str, Enum):
    EMPLOYEE = "employee"
    PRODUCT = "product"
    PURCHASE_ORDER = "purchase_order"
    SALES_ORDER = "sales_order"
    INVOICE = "invoice"
    PROJECT = "project"
    TASK = "task"
    CUSTOMER = "customer"
    SUPPLIER = "supplier"
    CONTRACT = "contract"


class Severity(str, Enum):
    DEBUG = "debug"
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"


class MFAStatus(str, Enum):
    DISABLED = "disabled"
    PENDING_SETUP = "pending_setup"
    ENABLED = "enabled"
    LOCKED = "locked"
    RECOVERY = "recovery"


class SessionStatus(str, Enum):
    ACTIVE = "active"
    EXPIRED = "expired"
    REVOKED = "revoked"
    TERMINATED = "terminated"


class ApiKeyStatus(str, Enum):
    ACTIVE = "active"
    EXPIRED = "expired"
    REVOKED = "revoked"


class RecurrencePattern(str, Enum):
    NONE = "none"
    DAILY = "daily"
    WEEKLY = "weekly"
    BIWEEKLY = "biweekly"
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    SEMI_ANNUALLY = "semi_annually"
    ANNUALLY = "annually"
    CUSTOM = "custom"


class ApprovalStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    NEEDS_REVIEW = "needs_review"
    ESCALATED = "escalated"
    DEFERRED = "deferred"


class ContractStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    EXPIRED = "expired"
    TERMINATED = "terminated"
    RENEWED = "renewed"
    CANCELLED = "cancelled"


class DiscountType(str, Enum):
    PERCENTAGE = "percentage"
    FIXED_AMOUNT = "fixed_amount"
    BUY_X_GET_Y = "buy_x_get_y"
    VOLUME = "volume"
    SEASONAL = "seasonal"
    PROMOTIONAL = "promotional"


class AddressType(str, Enum):
    BILLING = "billing"
    SHIPPING = "shipping"
    REGISTERED = "registered"
    WORK = "work"
    HOME = "home"
    WAREHOUSE = "warehouse"


class CommunicationType(str, Enum):
    EMAIL = "email"
    PHONE = "phone"
    SMS = "sms"
    LETTER = "letter"
    MEETING = "meeting"
    CALL = "call"
    CHAT = "chat"
