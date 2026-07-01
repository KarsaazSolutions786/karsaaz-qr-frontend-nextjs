/** Company contact details — override via NEXT_PUBLIC_* env in production. */
export const companyAddress = {
  line1:
    process.env.NEXT_PUBLIC_COMPANY_ADDRESS_LINE1 ??
    '85 Great Portland Street, First Floor,',
  line2:
    process.env.NEXT_PUBLIC_COMPANY_ADDRESS_LINE2 ?? 'London, W1W 7LT, United Kingdom',
}
