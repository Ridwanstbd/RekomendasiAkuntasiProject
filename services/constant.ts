const DEFAULT_ACCOUNTS = [
  { code: "1000", name: "Kas", type: "ASSET", category: "Aset Lancar" },
  {
    code: "1100",
    name: "Piutang Usaha",
    type: "ASSET",
    category: "Aset Lancar",
  },
  {
    code: "1200",
    name: "Persediaan Barang Dagang",
    type: "ASSET",
    category: "Aset Lancar",
  },
  {
    code: "1300",
    name: "Peralatan Usaha",
    type: "ASSET",
    category: "Aset Tetap",
  },
  {
    code: "2000",
    name: "Utang Usaha",
    type: "LIABILITY",
    category: "Liabilitas Jangka Pendek",
  },
  { code: "3000", name: "Modal Pemilik", type: "EQUITY", category: "Ekuitas" },
  { code: "3100", name: "Laba Ditahan", type: "EQUITY", category: "Ekuitas" },
  {
    code: "4000",
    name: "Pendapatan Penjualan",
    type: "REVENUE",
    category: "Pendapatan",
  },
  {
    code: "5000",
    name: "Harga Pokok Penjualan (HPP)",
    type: "EXPENSE",
    category: "Harga Pokok Penjualan",
  },
  {
    code: "6000",
    name: "Beban Operasional",
    type: "EXPENSE",
    category: "Beban Operasional",
  },
  {
    code: "6100",
    name: "Beban Listrik",
    type: "EXPENSE",
    category: "Beban Operasional",
  },
  {
    code: "6200",
    name: "Beban Air",
    type: "EXPENSE",
    category: "Beban Operasional",
  },
  {
    code: "6300",
    name: "Beban Internet & Telepon",
    type: "EXPENSE",
    category: "Beban Operasional",
  },
];

export default DEFAULT_ACCOUNTS;
