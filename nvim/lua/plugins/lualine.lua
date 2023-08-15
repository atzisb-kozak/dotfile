-- import lualine plugin safely
local status, lualine = pcall(require, "lualine")
if not status then
  return
end

-- get lualine gruvbox theme
local lualine_gruvbox = require("lualine.themes.gruvbox")

-- new colors for theme
local new_colors = {
  blue = "#65D1FF",
  green = "#3EFFDC",
  violet = "#FF61EF",
  yellow = "#FFDA7B",
  black = "#000000",
  uiuc_blue = "#13294B",
  uiuc_orange = "#E84A27",
}

-- change nightlfy theme colors
-- lualine_gruvbox.normal.a.bg = new_colors.blue
-- lualine_gruvbox.insert.a.bg = new_colors.uiuc_orange
-- lualine_gruvbox.visual.a.bg = new_colors.violet
-- lualine_gruvbox.command = {
--   a = {
--     gui = "bold",
--     bg = new_colors.yellow,
--     fg = new_colors.black, -- black
--   },
-- }

-- configure lualine with modified theme
lualine.setup({
  options = {
    theme = lualine_gruvbox,
  },
})
