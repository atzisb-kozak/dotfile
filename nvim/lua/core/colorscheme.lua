-- set colorscheme to nightfly with protected call
-- in case it isn't installed
local status, tn = pcall(require, "kanagawa")
if not status then
  print("Colorscheme not found!") -- print error if colorscheme not installed
  return
end

vim.cmd("colorscheme kanagawa-dragon")
