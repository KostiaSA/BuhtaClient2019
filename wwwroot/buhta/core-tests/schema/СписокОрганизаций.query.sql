-- запрос: buhta/core-tests/schema/СписокОрганизаций.query.json

/************** SQL-before: начало **************/
USE [MAG3666]
GO
/****** Object:  StoredProcedure [dbo].[Export_Add_Subconto]    Script Date: 19.12.2017 10:55:08 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER  PROCEDURE [dbo].[Export_Add_Subconto]
  @SubcontoNum VARCHAR(32), 
  @SubcontoName VARCHAR(50), 
  @SubcontoID INT OUTPUT , 
  @SubcontoType VARCHAR(5) OUTPUT
AS
BEGIN
  --Используется для экспорта документов в DBF-формате из "Бизнес-софт"
  --Режим реализован ввиде карточки пользователя
  DECLARE @s VARCHAR(32)
  SET @SubcontoID=ISNULL((SELECT Top 1 SubcontoID FROM #CashTable WHERE Number=@SubcontoNum AND SubcontoType=@SubcontoType),0)
  IF @SubcontoID=0
  BEGIN
      IF @SubcontoType='Орг'
      BEGIN
         SET @SubcontoID= ISNULL((SELECT Top 1 Ключ FROM [Организация] WITH (NOLOCK) WHERE Номер = @SubcontoNum),0)
         IF @SubcontoID=0
         BEGIN
           BEGIN TRAN
             INSERT [Организация] WITH(TABLOCK) (Номер, Название) VALUES(@SubcontoNum, @SubcontoName)
             SET @SubcontoID=IDENT_CURRENT('Организация')
           COMMIT
         END
      END
      ELSE      
      IF @SubcontoType='ОС'
      BEGIN
        SET @SubcontoID= ISNULL((SELECT Top 1 Ключ FROM [ОС] WITH (NOLOCK) WHERE Номер = @SubcontoNum),0)
        IF @SubcontoID=0
        BEGIN
           BEGIN TRAN
             INSERT [ОС] WITH(TABLOCK) (Номер, Название) VALUES(@SubcontoNum, @SubcontoName)
             SET @SubcontoID=IDENT_CURRENT('ОС')
           COMMIT
         END
      END
      ELSE
      IF @SubcontoType='Пар'
      BEGIN
        SET @SubcontoID= ISNULL((SELECT Top 1 Ключ FROM [Партия ТМЦ] WITH (NOLOCK) WHERE Номер = @SubcontoNum),0)
        IF @SubcontoID=0
        BEGIN 
          BEGIN TRAN
            INSERT [Партия ТМЦ] WITH(TABLOCK) (Номер, Название) VALUES(@SubcontoNum, @SubcontoName)
            SET @SubcontoID=IDENT_CURRENT('Партия ТМЦ')
          COMMIT
        END
      END
      ELSE
      IF @SubcontoType='Под'
      BEGIN
        SET @SubcontoID=0
        IF LEN(@SubcontoNum)<=3
        BEGIN
          SET @SubcontoID=ISNULL((SELECT Top 1 Ключ FROM [Подразделение] WITH (NOLOCK) WHERE Номер = REPLICATE('0', 3 - LEN(@SubcontoNum)) + @SubcontoNum),0)
        END
        IF @SubcontoID=0
        BEGIN
          SET @SubcontoID= ISNULL((SELECT Top 1 Ключ FROM [Подразделение] WITH (NOLOCK) WHERE Номер = @SubcontoNum),0)
          IF @SubcontoID=0
          BEGIN
            SET @s= @SubcontoNum
            IF LEN(@SubcontoNum)<=3
            BEGIN
              SET @s = REPLICATE('0', 3 - LEN(@SubcontoNum)) + @SubcontoNum
            END
            BEGIN TRAN
              INSERT [Подразделение] WITH(TABLOCK) (Номер, Название) VALUES(@s, @SubcontoName)
              SET @SubcontoID=IDENT_CURRENT('Подразделение')
            COMMIT
          END
        END
      END
      ELSE
      IF @SubcontoType='Прч'
      BEGIN
        SET @SubcontoID= ISNULL((SELECT Top 1 Ключ FROM [Прочий] WITH (NOLOCK) WHERE Номер = @SubcontoNum),0)
        IF @SubcontoID=0
        BEGIN
          BEGIN TRAN
            INSERT [Прочий] WITH(TABLOCK) (Номер, Название) VALUES(@SubcontoNum, @SubcontoName)
            SET @SubcontoID=IDENT_CURRENT('Прочий')
          COMMIT
        END
      END
      ELSE
      IF @SubcontoType='ТМЦ'
      BEGIN
        SET @SubcontoID= ISNULL((SELECT Top 1 Ключ FROM [ТМЦ] WITH (NOLOCK) WHERE Номер = @SubcontoNum),0)
        IF @SubcontoID=0
        BEGIN
          BEGIN TRAN
            INSERT [ТМЦ] WITH(TABLOCK) (Номер, Название) VALUES(@SubcontoNum, @SubcontoName)
            SET @SubcontoID=IDENT_CURRENT('ТМЦ')
          COMMIT
        END
      END
      ELSE
      IF @SubcontoType='Чел'
      BEGIN
        SET @SubcontoID= ISNULL((SELECT Top 1 Ключ FROM [Сотрудник] WITH (NOLOCK) WHERE Номер = @SubcontoNum),0)
        IF @SubcontoID=0
        BEGIN
          BEGIN TRAN
            DECLARE @FirstName VARCHAR(32)
            DECLARE @SecondName VARCHAR(32)
            DECLARE @ThridName VARCHAR(32)
            DECLARE @sss varchar(150)
            SET @ThridName = ''
    SET @sss = ''
    SET @FirstName = ''
    SET @SecondName=''
    DECLARE @SpaceINDex INT
    SET @SpaceINDex=CHARINDEX(CHAR(32), @SubcontoName)
    IF @SpaceINDex<>0
    BEGIN
      SET @ThridName = SUBSTRING(@SubcontoName, 1, @SpaceINDex-1)
      SET @sss = SUBSTRING(@SubcontoName, 1+LEN(@ThridName), LEN(@SubcontoName)-LEN(@ThridName)+1)
      SET @sss = LTRIM(RTRIM(@sss))
      SET @SpaceINDex=CHARINDEX(CHAR(32), @sss)
      IF @SpaceINDex<>0
        SET @FirstName = SUBSTRING(@sss, 1, @SpaceINDex-1)
      ELSE
        SET @FirstName=@sss
      SET @SecondName=SUBSTRING(@sss, CHARINDEX(CHAR(32), @sss)+1, LEN(@sss)-LEN(@FirstName)+1) 
    END
    ELSE
     SET @ThridName = @SubcontoName      


            INSERT [Сотрудник] WITH(TABLOCK)(Номер, Фамилия, Имя, Отчество) VALUES(@SubcontoNum, @ThridName,@FirstName,@SecondName)
          COMMIT
        END
      END
      ELSE 
      BEGIN 
         SET @SubcontoID=0 
         SET @SubcontoType='Нет'
      END
      INSERT #CashTable (SubcontoType,SubcontoID,Number)
         VALUES(@SubcontoType, @SubcontoID, @SubcontoNum)
  END
--  print @SubcontoType + ' ' +STR(@SubcontoID)
END











/************** SQL-before: конец  **************/

SELECT
    [Организация].[Номер] AS [Номер],
    [Организация].[Название] AS [Название],
    [Организация.Сотрудник].[Номер] AS [ДирНомер178],
    [Организация.Сотрудник].[Фамилия] AS [Дир-Фамилия],
    [Организация.Сотрудник].[Отчество] AS [Отчество],
    [Организация.Сотрудник].[ИНН] AS [ИНН],
    [Организация.Сотрудник].[ДатаРождения] AS [Рожд],
    [Организация].[ИНН] AS [ИНН],
    [Организация].[Ключ] AS [Ключ],
    [Организация].[Ключ] AS [__recordId__],
    /************** SQL-select: начало **************/
    '222'+[Организация.Сотрудник].[Фамилия] AS [Дир-Фамилия],
    /************** SQL-select: конец  **************/
FROM
    [buhta_core_tests_schema_Организация] AS [Организация]
    LEFT JOIN [СотрXXX] AS [Организация.Сотрудник]
    ON [Организация].[Директор]=[Организация.Сотрудник].[Ключ]
    /************** SQL-join: начало **************/
    JOIN xxx on 1123=897
    
    /************** SQL-join: конец  **************/
WHERE
    /************** SQL-where: начало *************/
    234=456
    /************** SQL-where: конец  *************/

/************** SQL-after: начало **************/
USE [MAG3666]
GO
/****** Object:  StoredProcedure [dbo].[_авто_Документ_210_генерация]    Script Date: 20.12.2017 0:19:35 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[_авто_Документ_210_генерация] (@DocID Int,@UseTempSaldo TinyInt=0,@Konturs VARCHAR(1000)='')
AS
DECLARE @CustomsPercent MONEY
-- для алгоритма зачет аванса
DECLARE @AvansSumma62 MONEY
DECLARE @AvansSumma64 MONEY
DECLARE @AvansOperDate SMALLDATETIME
DECLARE @AvansDbDate   SMALLDATETIME
DECLARE @AvansKrDate   SMALLDATETIME
DECLARE @WithNullKorrsOk INT
DECLARE @WithDiffKonturOk INT
DECLARE @KontursNullOk INT
DECLARE @KontursPustOk INT
SET @WithNullKorrsOk =0
SET @WithDiffKonturOk =0
SET @WithNullKorrsOk = ISNULL((SELECT TOP 1 Значение FROM Настройка WITH(NOLOCK) WHERE Секция='Генерация проводок' AND Параметр='Генерация с пустым корр.счетом'),0)
SET @WithDiffKonturOk= ISNULL((SELECT TOP 1 Значение FROM Настройка WITH(NOLOCK) WHERE Секция='Генерация проводок' AND Параметр='Генерация с разными контурами'),0)
SET @KontursNullOk =0
SET @KontursPustOk =0
SET @Konturs=','+@Konturs+','
IF @Konturs LIKE '%,<Пустой контур>,%' SET @KontursPustOk =1
IF @Konturs LIKE '%,<Пустой счет>,%'   SET @KontursNullOk =1
BEGIN TRANSACTION

  IF @Konturs>',,'
  BEGIN
    DELETE Проводка WITH(ROWLOCK) FROM Проводка
      LEFT OUTER JOIN Счет ДбСчет ON ДбСчет.Номер=Проводка.Дебет
      LEFT OUTER JOIN Счет КрСчет ON КрСчет.Номер=Проводка.Кредит
      WHERE Документ=@DocID AND ГенТип>0 
            AND (@Konturs LIKE 
            '%,'+(case when @KontursNullOk=1 and ДбСчет.[Контур учета] IS NULL then '<Пустой счет>' when @KontursPustOk=1 and ltrim(rtrim(ДбСчет.[Контур учета]))='' then '<Пустой контур>' else ДбСчет.[Контур учета] end)+',%' 
              OR @Konturs LIKE 
            '%,'+(case when @KontursNullOk=1 and КрСчет.[Контур учета] IS NULL then '<Пустой счет>' when @KontursPustOk=1 and ltrim(rtrim(КрСчет.[Контур учета]))='' then '<Пустой контур>' else КрСчет.[Контур учета] end)+',%')
            AND (@WithNullKorrsOk=1 OR 
                ( (case when @KontursNullOk=1 and ДбСчет.[Контур учета] IS NULL then '<Пустой счет>' else ДбСчет.[Контур учета] end) IS NOT NULL 
              AND (case when @KontursNullOk=1 and КрСчет.[Контур учета] IS NULL then '<Пустой счет>' else КрСчет.[Контур учета] end) IS NOT NULL) )
            AND (@WithDiffKonturOk=1 
                 OR (case when @KontursNullOk=1 and ДбСчет.[Контур учета] IS NULL then '<Пустой счет>' else ДбСчет.[Контур учета] end)=
                    (case when @KontursNullOk=1 and КрСчет.[Контур учета] IS NULL then '<Пустой счет>' else КрСчет.[Контур учета] end) 
                 OR (@WithNullKorrsOk=1 AND ДбСчет.[Контур учета] IS NULL AND @Konturs LIKE 
        '%,'+(case when @KontursNullOk=1 and КрСчет.[Контур учета] IS NULL then '<Пустой счет>' when @KontursPustOk=1 and ltrim(rtrim(КрСчет.[Контур учета]))='' then '<Пустой контур>' else КрСчет.[Контур учета] end)+',%')
                 OR (@WithNullKorrsOk=1 AND КрСчет.[Контур учета] IS NULL AND @Konturs LIKE 
        '%,'+(case when @KontursNullOk=1 and ДбСчет.[Контур учета] IS NULL then '<Пустой счет>' when @KontursPustOk=1 and ltrim(rtrim(ДбСчет.[Контур учета]))='' then '<Пустой контур>' else ДбСчет.[Контур учета] end)+',%'))
  END
  ELSE
    DELETE FROM Проводка WITH(ROWLOCK) WHERE Документ=@DocID AND ГенТип>0
  SELECT * INTO #Документ FROM Документ WITH(NOLOCK) WHERE [Ключ]=@DocID
  IF (SELECT TOP 1 [Проведен] FROM [#Документ])=0
  BEGIN
    UPDATE Документ SET [Ошибки генерации]=0 WHERE [Ключ]=@DocID
    EXECUTE [Заполнение суммы документа] @DocID,2
    COMMIT
    RETURN
  END
  SELECT * INTO #Докспец FROM Докспец WITH(NOLOCK) WHERE [Документ]=@DocID
  CREATE UNIQUE CLUSTERED INDEX [IX_Докспец_Ключ1234565] ON [#Докспец] (Вид, Ключ)
  SELECT * INTO #Договор FROM Договор WITH(NOLOCK) WHERE [Ключ]=(SELECT [Договор] FROM [#Документ])

CREATE TABLE #ГенПроводка (
  [Ключ] INT IDENTITY(1,1),
  [Вид] INT NOT NULL DEFAULT(0),
  [Дата] [datetime] NOT NULL  DEFAULT(0),
  [Юр.лицо] [smallint] NOT NULL  DEFAULT(0),
  [Дебет] [varchar] (10) NOT NULL DEFAULT(''),
  [Дб тип субконто 1] [varchar] (3) NOT NULL DEFAULT('Нет'),
  [Дб субконто 1] [int] NOT NULL  DEFAULT(0),
  [Дб тип субконто 2] [varchar] (3) NOT NULL DEFAULT('Нет'),
  [Дб субконто 2] [int] NOT NULL  DEFAULT(0),
  [Дб тип субконто 3] [varchar] (3) NOT NULL DEFAULT('Нет'),
  [Дб субконто 3] [int] NOT NULL  DEFAULT(0),
  [Дб тип субконто 4] [varchar] (3) NOT NULL DEFAULT('Нет'),
  [Дб субконто 4] [int] NOT NULL  DEFAULT(0),
  [Дб тип субконто 5] [varchar] (3) NOT NULL DEFAULT('Нет'),
  [Дб субконто 5] [int] NOT NULL  DEFAULT(0),
  [Дб количество] [money] NOT NULL  DEFAULT(0),
  [Дб количество 2] [money] NOT NULL  DEFAULT(0),
  [Кредит] [varchar] (10) NOT NULL DEFAULT(''),
  [Кр тип субконто 1] [varchar] (3) NOT NULL DEFAULT('Нет'),
  [Кр субконто 1] [int] NOT NULL  DEFAULT(0),
  [Кр тип субконто 2] [varchar] (3) NOT NULL DEFAULT('Нет'),
  [Кр субконто 2] [int] NOT NULL  DEFAULT(0),
  [Кр тип субконто 3] [varchar] (3) NOT NULL DEFAULT('Нет'),
  [Кр субконто 3] [int] NOT NULL  DEFAULT(0),
  [Кр тип субконто 4] [varchar] (3) NOT NULL DEFAULT('Нет'),
  [Кр субконто 4] [int] NOT NULL  DEFAULT(0),
  [Кр тип субконто 5] [varchar] (3) NOT NULL DEFAULT('Нет'),
  [Кр субконто 5] [int] NOT NULL  DEFAULT(0),
  [Кр количество] [money] NOT NULL  DEFAULT(0),
  [Кр количество 2] [money] NOT NULL  DEFAULT(0),
  [Сумма] [money] NOT NULL  DEFAULT(0),
  [Валюта] [smallint] NOT NULL  DEFAULT(0),
  [Сумма руб.] [money] NOT NULL  DEFAULT(0),
  [Курс руб.] VARCHAR(20) NOT NULL  DEFAULT(''),
  [Сумма у.е.] [money] NOT NULL  DEFAULT(0),
  [Курс у.е.] VARCHAR(20) NOT NULL  DEFAULT(''),
  [Входит в сумму] [bit] NOT NULL DEFAULT(0),
  [Примечание] VARCHAR(500) NOT NULL  DEFAULT(''),
  [Ошибки генерации] [int] NOT NULL DEFAULT(0),
  [Зарплата] [int] NOT NULL DEFAULT(0),
  [Докспец] [int] NOT NULL DEFAULT(0),
  [Не формировать проводку] [bit] NOT NULL DEFAULT(0))

  DECLARE @DbKontur VARCHAR(20)
  DECLARE @KrKontur VARCHAR(20)
  DECLARE @ErrorCount INT
  SET @ErrorCount=0
  DECLARE @NeedChangeDbKr TINYINT
  DECLARE @Vid INT
  DECLARE @Kontora TINYINT
  DECLARE @DocDate_ForGenFilter DATETIME
  DECLARE @Date DATETIME
  DECLARE @DateFIFO DATETIME
  DECLARE @DateFirst DateTime
  DECLARE @Debet VARCHAR(10)
  DECLARE @DateLast DateTime
  DECLARE @DbSubconto1Type VARCHAR(3)
  DECLARE @DbSubconto1 INT
  DECLARE @DbSubconto2Type VARCHAR(3)
  DECLARE @DbSubconto2 INT
  DECLARE @DbSubconto3Type VARCHAR(3)
  DECLARE @DbSubconto3 INT
  DECLARE @DbSubconto4Type VARCHAR(3)
  DECLARE @DbSubconto4 INT
  DECLARE @DbSubconto5Type VARCHAR(3)
  DECLARE @DbSubconto5 INT
  DECLARE @DbKol MONEY
  DECLARE @DbKol2 MONEY
  DECLARE @PartDbKol MONEY
  DECLARE @PartDbKol2 MONEY
  DECLARE @DbNetto MONEY
  DECLARE @DbBrutto MONEY
  DECLARE @Kredit VARCHAR(10)
  DECLARE @KrSubconto1Type VARCHAR(3)
  DECLARE @KrSubconto1 INT
  DECLARE @KrSubconto2Type VARCHAR(3)
  DECLARE @KrSubconto2 INT
  DECLARE @KrSubconto3Type VARCHAR(3)
  DECLARE @KrSubconto3 INT
  DECLARE @KrSubconto4Type VARCHAR(3)
  DECLARE @KrSubconto4 INT
  DECLARE @KrSubconto5Type VARCHAR(3)
  DECLARE @KrSubconto5 INT
  DECLARE @KrNetto MONEY
  DECLARE @KrBrutto MONEY
  DECLARE @KrKol MONEY
  DECLARE @KrKol2 MONEY
  DECLARE @Summa MONEY
  DECLARE @Valuta SMALLINT
  DECLARE @SummaRub MONEY
  DECLARE @KursRub VARCHAR(20)
  DECLARE @SummaUSD MONEY
  DECLARE @KursUSD VARCHAR(20)
  DECLARE @InSumma BIT
  DECLARE @Note VARCHAR(500)
  DECLARE @DocSpec INT
  DECLARE @WithoutCreate BIT -- 1 - не создавать проводку (проводка удаляется после генерации остальных проводок)
  DECLARE @FIFOErrorMode TinyInt -- 0 - создавать проводку с ошибкой FIFO, 1 - создавать с предупреждением, 2 - не создавать
  DECLARE @FIFOErrorMsg Varchar(100)
  DECLARE @NoteFromSource BIT
  DECLARE @NoteGenProv VARCHAR(50)
  DECLARE @RoundFIFOKol2 SMALLINT
  DECLARE @CheckKol2ByFIFO BIT
  DECLARE @CheckKol2BySource BIT

SET @Kontora = ISNULL((SELECT [Юр.лицо] FROM Документ WITH(NOLOCK) WHERE Ключ=@DocID), 0)
SET @DocDate_ForGenFilter = ISNULL((SELECT [Дата] FROM Документ WITH(NOLOCK) WHERE Ключ=@DocID), 0)
  DECLARE  @FIFOSaldoSubconto1Type VARCHAR(3)
  DECLARE  @FIFOSaldoSubconto1 INT
  DECLARE  @FIFOSaldoSubconto2Type VARCHAR(3)
  DECLARE  @FIFOSaldoSubconto2 INT
  DECLARE  @FIFOSaldoSubconto3Type VARCHAR(3)
  DECLARE  @FIFOSaldoSubconto3 INT
  DECLARE  @FIFOSaldoSubconto4Type VARCHAR(3)
  DECLARE  @FIFOSaldoSubconto4 INT
  DECLARE  @FIFOSaldoSubconto5Type VARCHAR(3)
  DECLARE  @FIFOSaldoSubconto5 INT
  DECLARE  @FIFOSaldoKol MONEY
  DECLARE  @FIFOSaldoKol2 MONEY
  DECLARE  @FIFOSaldoSumma MONEY
  DECLARE  @FIFOSaldoSummaRub MONEY
  DECLARE  @FIFOSaldoSummaUSD MONEY
  DECLARE  @FIFONeedSumma MONEY
  DECLARE  @ValutaStr VarChar(20)
  DECLARE  @FIFONeedSummaSaved MONEY
  DECLARE  @FIFONeedSummaRub MONEY
  DECLARE  @FIFONeedSummaUSD MONEY
  DECLARE  @FIFONeedKol MONEY
  DECLARE  @FIFONeedKolSaved MONEY
  DECLARE  @FIFONeedKol2 MONEY
  DECLARE  @FIFOKol2All MONEY
  DECLARE @OperDate DATETIME
  IF @UseTempSaldo=0
    SELECT  @OperDate=ISNULL([Дата],0) FROM СальдоДата WITH(NOLOCK) WHERE [Юр.лицо]=(SELECT [Юр.лицо] FROM [Документ] WITH(NOLOCK) WHERE [Ключ]=@DocID)
  ELSE
    SELECT  TOP 1 @OperDate=ISNULL(MAX([Дата]),0) FROM #FIFOSaldo

  DECLARE @SourceSpecID Int
  DECLARE @SourceSpecVid Int

  DECLARE SourceSpecCurs210 CURSOR LOCAL STATIC FOR
    SELECT [Ключ],[Вид] FROM #Докспец WITH(NOLOCK) WHERE Документ=@DocID

  OPEN SourceSpecCurs210

  FETCH NEXT FROM SourceSpecCurs210 INTO @SourceSpecID,@SourceSpecVid
  WHILE @@FETCH_STATUS = 0
  BEGIN
    IF @SourceSpecVid=210001
    BEGIN
      SET  @Vid=0
      SET @AvansSumma62 = 0
      SET @AvansSumma64 = 0
      SET @WithoutCreate = 0
      SET @FIFOErrorMode = 0
      SET @FIFOErrorMsg  = 'Ошибка FIFO' 
      SET @NoteFromSource = 0
      SET @NoteGenProv = ''
      SET @RoundFIFOKol2 = 4
      SET @CheckKol2ByFIFO = 0
      SET @CheckKol2BySource = 0
      SELECT
         @Vid=210001,
         @Date=CASE [Докспец].[Дата] WHEN '19000101' THEN [Документ].[Дата] ELSE [Докспец].[Дата] END,
         @CustomsPercent=ISNULL([Докспец].[Ставка таможенной пошлины], 0),
         @DateFIFO=@Date,
         @Debet='41.2',
         @DbSubconto1Type=[Документ].[Тип поставщика],
         @DbSubconto1=[Документ].[Поставщик],
         @DbSubconto2Type=[Докспец].[Тип субконто 1],
         @DbSubconto2=[Докспец].[Субконто 1],
         @DbSubconto3Type=[Докспец].[Тип субконто 2],
         @DbSubconto3=[Докспец].[Субконто 2],
         @DbSubconto4Type='Нет',
         @DbSubconto4=0,
         @DbSubconto5Type='Нет',
         @DbSubconto5=0,
         @DbKol=[Докспец].[Количество],
         @DbKol2=0,
         @DbNetto= ISNULL([Докспец].[Нетто], 0),
         @DbBrutto= ISNULL([Докспец].[Брутто], 0),
         @KrNetto= 0,
         @KrBrutto= 0,
         @Kredit='41.2',
         @KrSubconto1Type=[Документ].[Тип поставщика],
         @KrSubconto1=[Документ].[Поставщик],
         @KrSubconto2Type=[Докспец].[Тип субконто 1],
         @KrSubconto2=[Докспец].[Субконто 1],
         @KrSubconto3Type=[Докспец].[Тип субконто 2],
         @KrSubconto3=[Докспец].[Субконто 2],
         @KrSubconto4Type='Нет',
         @KrSubconto4=0,
         @KrSubconto5Type='Нет',
         @KrSubconto5=0,
         @KrKol=[Докспец].[Количество],
         @KrKol2=0,
         @Summa=0,
         @Valuta=99,
         @SummaRub=0,
         @KursRub='',
         @SummaUSD=0,
         @KursUSD='',
         @InSumma=1,
        @Note='',
        -- SQLSelect (начало), спец. [1]  Приход товара, пров. [1]  Расход товара
  @DbSubconto1=isnull((select ПодрРезерв from _Магазин where ключ=Договор._Магазин),Документ.Поставщик),
  @DbSubconto3Type=(case when Докспец.[субконто 2]<>0 then Докспец.[тип субконто 2] else 'Нет' end),
  @KrSubconto3Type=(case when Докспец.[субконто 2]<>0 then Докспец.[тип субконто 2] else 'Нет' end),
   @KrKol=(case when [dbo].[_ЭтоУслуга](Докспец.[Субконто 1])=1 then 0
                when [dbo].[_ЭтоСвоеПодразделение](Документ.Поставщик)=0 then 0
                when Докспец.[_СтатусЗаказа]='Ожидание товара' then 0 else Докспец.Количество end )
        -- SQLSelect (конец), спец. [1]  Приход товара, пров. [1]  Расход товара

        FROM #Докспец Докспец
          LEFT OUTER JOIN #Документ Документ
            LEFT OUTER JOIN #Договор Договор ON [Документ].[Договор]=[Договор].[Ключ]
          ON [Докспец].[Документ]=[Документ].[Ключ]
        WHERE Докспец.Ключ=@SourceSpecID
----- фильтрация по контурам учета
      IF @Konturs>',,'
      BEGIN 
        SET @DbKontur=(SELECT [Контур учета] FROM Счет WITH(NOLOCK) WHERE Номер=@Debet)
        SET @KrKontur=(SELECT [Контур учета] FROM Счет WITH(NOLOCK) WHERE Номер=@Kredit)
        IF @KontursPustOk =1
        BEGIN
          IF @DbKontur='' SET @DbKontur='<Пустой контур>'
          IF @KrKontur='' SET @KrKontur='<Пустой контур>'
        END
        IF @KontursNullOk =1
        BEGIN
          IF @DbKontur IS NULL SET @DbKontur='<Пустой счет>'
          IF @KrKontur IS NULL SET @KrKontur='<Пустой счет>'
        END
      END 
      IF @Konturs=',,' OR 
         (   (@Konturs LIKE '%,'+@DbKontur+',%' OR @Konturs LIKE '%,'+@KrKontur+',%')
         AND (@WithNullKorrsOk=1 OR (@DbKontur IS NOT NULL AND @KrKontur IS NOT NULL))
         AND (@WithDiffKonturOk=1 OR @DbKontur=@KrKontur OR @DbKontur IS NULL OR @KrKontur IS NULL OR 
             (@WithNullKorrsOk=1 AND @DbKontur='<Пустой счет>' and @Konturs LIKE '%,'+@KrKontur+',%') OR (@WithNullKorrsOk=1 AND @KrKontur='<Пустой счет>' and @Konturs LIKE '%,'+@DbKontur+',%') ) )
      BEGIN 

    IF @Vid<>0
    BEGIN
      IF @UseTempSaldo=0
      BEGIN
  SET @DateFIFO = @Date
Set @DateFirst = dbo.[Первый день месяца](@DateFIFO)
Set @DateLast = dbo.[Последний день месяца](@DateFIFO)
        DECLARE FIFOSaldoCurs4 CURSOR LOCAL STATIC FOR
        SELECT
          OBOROT.Валюта,
          SUM(OBOROT.[Количество]),
          SUM(OBOROT.[Количество 2]),
          SUM(OBOROT.[Сумма]),
          SUM(OBOROT.[Сумма руб.]),
          SUM(OBOROT.[Сумма у.е.])
        FROM (
          SELECT [Юр.лицо],
          Валюта,
          SUM([Сумма]) [Сумма],
          SUM([Сумма руб.]) [Сумма руб.],
          SUM([Сумма у.е.]) [Сумма у.е.],
          SUM([Количество]) Количество,
          SUM([Количество 2]) [Количество 2]
          FROM Сальдо WITH(NOLOCK)
          WHERE
            [Юр.лицо]=@Kontora AND
            Счет=@Kredit AND
            [Тип субконто 1]=@KrSubconto1Type AND
            [Субконто 1]=@KrSubconto1 AND
            [Тип субконто 2]=@KrSubconto2Type AND
            [Субконто 2]=@KrSubconto2 AND
            [Тип субконто 3]=@KrSubconto3Type AND
            [Субконто 3]=@KrSubconto3 
          GROUP BY [Юр.лицо],Валюта
          UNION ALL
          SELECT [Юр.лицо],Валюта,
          SUM([Сумма]) [Сумма],
          SUM([Сумма руб.]) [Сумма руб.],
          SUM([Сумма у.е.]) [Сумма у.е.],
          SUM([Дб количество]),
          SUM([Дб количество 2])
          FROM Проводка WITH(NOLOCK)
          WHERE
            [Юр.лицо]=@Kontora AND
            Документ<>@DocID AND
            Дебет=@Kredit AND
            [Дб тип субконто 1]=@KrSubconto1Type AND
            [Дб субконто 1]=@KrSubconto1 AND
            [Дб тип субконто 2]=@KrSubconto2Type AND
            [Дб субконто 2]=@KrSubconto2 AND
            [Дб тип субконто 3]=@KrSubconto3Type AND
            [Дб субконто 3]=@KrSubconto3 AND
            Дата BETWEEN @OperDate AND @DateFIFO
          GROUP BY [Юр.лицо],Валюта
          UNION ALL
          SELECT [Юр.лицо],Валюта,
          -SUM([Сумма]) [Сумма],
          -SUM([Сумма руб.]) [Сумма руб.],
          -SUM([Сумма у.е.]) [Сумма у.е.],
          -SUM([Кр количество]),
          -SUM([Кр количество 2])
          FROM Проводка WITH(NOLOCK)
          WHERE
            [Юр.лицо]=@Kontora AND
            Документ<>@DocID AND
            Кредит=@Kredit AND
            [Кр тип субконто 1]=@KrSubconto1Type AND
            [Кр субконто 1]=@KrSubconto1 AND
            [Кр тип субконто 2]=@KrSubconto2Type AND
            [Кр субконто 2]=@KrSubconto2 AND
            [Кр тип субконто 3]=@KrSubconto3Type AND
            [Кр субконто 3]=@KrSubconto3 AND
            Дата BETWEEN @OperDate AND @DateFIFO
          GROUP BY [Юр.лицо],Валюта
          UNION ALL
          SELECT [Юр.лицо],Валюта,
          SUM([Сумма]) [Сумма],
          SUM([Сумма руб.]) [Сумма руб.],
          SUM([Сумма у.е.]) [Сумма у.е.],
          SUM([Дб количество]),
          SUM([Дб количество 2])
          FROM #ГенПроводка
          WHERE
            [Юр.лицо]=@Kontora AND
            Дебет=@Kredit AND
            [Дб тип субконто 1]=@KrSubconto1Type AND
            [Дб субконто 1]=@KrSubconto1 AND
            [Дб тип субконто 2]=@KrSubconto2Type AND
            [Дб субконто 2]=@KrSubconto2 AND
            [Дб тип субконто 3]=@KrSubconto3Type AND
            [Дб субконто 3]=@KrSubconto3 AND
            Дата BETWEEN @OperDate AND @DateFIFO
          GROUP BY [Юр.лицо],Валюта
          UNION ALL
          SELECT [Юр.лицо],Валюта,
          -SUM([Сумма]) [Сумма],
          -SUM([Сумма руб.]) [Сумма руб.],
          -SUM([Сумма у.е.]) [Сумма у.е.],
          -SUM([Кр количество]),
          -SUM([Кр количество 2])
          FROM #ГенПроводка
          WHERE
            [Юр.лицо]=@Kontora AND
            Кредит=@Kredit AND
            [Кр тип субконто 1]=@KrSubconto1Type AND
            [Кр субконто 1]=@KrSubconto1 AND
            [Кр тип субконто 2]=@KrSubconto2Type AND
            [Кр субконто 2]=@KrSubconto2 AND
            [Кр тип субконто 3]=@KrSubconto3Type AND
            [Кр субконто 3]=@KrSubconto3 AND
            Дата BETWEEN @OperDate AND @DateFIFO
          GROUP BY [Юр.лицо],Валюта
         ) OBOROT
             WHERE (1=1) 
         GROUP BY OBOROT.[Юр.лицо],OBOROT.[Валюта]
          HAVING SUM(OBOROT.[Количество])>0
          ORDER BY OBOROT.[Юр.лицо],
          OBOROT.[Валюта]
      END
      ELSE
      BEGIN
  SET @DateFIFO = @Date
Set @DateFirst = dbo.[Первый день месяца](@DateFIFO)
Set @DateLast = dbo.[Последний день месяца](@DateFIFO)
        DECLARE FIFOSaldoCurs4 CURSOR LOCAL STATIC FOR
        SELECT
          OBOROT.Валюта,
          SUM(OBOROT.[Количество]),
          SUM(OBOROT.[Количество 2]),
          SUM(OBOROT.[Сумма]),
          SUM(OBOROT.[Сумма руб.]),
          SUM(OBOROT.[Сумма у.е.])
        FROM (
          SELECT [Юр.лицо],
          Валюта,
          SUM([Сумма]) [Сумма],
          SUM([Сумма руб.]) [Сумма руб.],
          SUM([Сумма у.е.]) [Сумма у.е.],
          SUM([Количество]) Количество,
          SUM([Количество 2]) [Количество 2]
          FROM #FIFOSaldo
          WHERE
            [Юр.лицо]=@Kontora AND
            Счет=@Kredit AND
            [Тип субконто 1]=@KrSubconto1Type AND
            [Субконто 1]=@KrSubconto1 AND
            [Тип субконто 2]=@KrSubconto2Type AND
            [Субконто 2]=@KrSubconto2 AND
            [Тип субконто 3]=@KrSubconto3Type AND
            [Субконто 3]=@KrSubconto3 
          GROUP BY [Юр.лицо],Валюта
          UNION ALL
          SELECT [Юр.лицо],Валюта,
          SUM([Сумма]) [Сумма],
          SUM([Сумма руб.]) [Сумма руб.],
          SUM([Сумма у.е.]) [Сумма у.е.],
          SUM([Дб количество]),
          SUM([Дб количество 2])
          FROM Проводка WITH(NOLOCK)
          WHERE
            [Юр.лицо]=@Kontora AND
            Документ<>@DocID AND
            Дебет=@Kredit AND
            [Дб тип субконто 1]=@KrSubconto1Type AND
            [Дб субконто 1]=@KrSubconto1 AND
            [Дб тип субконто 2]=@KrSubconto2Type AND
            [Дб субконто 2]=@KrSubconto2 AND
            [Дб тип субконто 3]=@KrSubconto3Type AND
            [Дб субконто 3]=@KrSubconto3 AND
            Дата BETWEEN @OperDate AND @DateFIFO
          GROUP BY [Юр.лицо],Валюта
          UNION ALL
          SELECT [Юр.лицо],Валюта,
          -SUM([Сумма]) [Сумма],
          -SUM([Сумма руб.]) [Сумма руб.],
          -SUM([Сумма у.е.]) [Сумма у.е.],
          -SUM([Кр количество]),
          -SUM([Кр количество 2])
          FROM Проводка WITH(NOLOCK)
          WHERE
            [Юр.лицо]=@Kontora AND
            Документ<>@DocID AND
            Кредит=@Kredit AND
            [Кр тип субконто 1]=@KrSubconto1Type AND
            [Кр субконто 1]=@KrSubconto1 AND
            [Кр тип субконто 2]=@KrSubconto2Type AND
            [Кр субконто 2]=@KrSubconto2 AND
            [Кр тип субконто 3]=@KrSubconto3Type AND
            [Кр субконто 3]=@KrSubconto3 AND
            Дата BETWEEN @OperDate AND @DateFIFO
          GROUP BY [Юр.лицо],Валюта
          UNION ALL
          SELECT [Юр.лицо],Валюта,
          SUM([Сумма]) [Сумма],
          SUM([Сумма руб.]) [Сумма руб.],
          SUM([Сумма у.е.]) [Сумма у.е.],
          SUM([Дб количество]),
          SUM([Дб количество 2])
          FROM #ГенПроводка
          WHERE
            [Юр.лицо]=@Kontora AND
            Дебет=@Kredit AND
            [Дб тип субконто 1]=@KrSubconto1Type AND
            [Дб субконто 1]=@KrSubconto1 AND
            [Дб тип субконто 2]=@KrSubconto2Type AND
            [Дб субконто 2]=@KrSubconto2 AND
            [Дб тип субконто 3]=@KrSubconto3Type AND
            [Дб субконто 3]=@KrSubconto3 AND
            Дата BETWEEN @OperDate AND @DateFIFO
          GROUP BY [Юр.лицо],Валюта
          UNION ALL
          SELECT [Юр.лицо],Валюта,
          -SUM([Сумма]) [Сумма],
          -SUM([Сумма руб.]) [Сумма руб.],
          -SUM([Сумма у.е.]) [Сумма у.е.],
          -SUM([Кр количество]),
          -SUM([Кр количество 2])
          FROM #ГенПроводка
          WHERE
            [Юр.лицо]=@Kontora AND
            Кредит=@Kredit AND
            [Кр тип субконто 1]=@KrSubconto1Type AND
            [Кр субконто 1]=@KrSubconto1 AND
            [Кр тип субконто 2]=@KrSubconto2Type AND
            [Кр субконто 2]=@KrSubconto2 AND
            [Кр тип субконто 3]=@KrSubconto3Type AND
            [Кр субконто 3]=@KrSubconto3 AND
            Дата BETWEEN @OperDate AND @DateFIFO
          GROUP BY [Юр.лицо],Валюта
         ) OBOROT
             WHERE (1=1) 
         GROUP BY OBOROT.[Юр.лицо],OBOROT.[Валюта]
          HAVING SUM(OBOROT.[Количество])>0
          ORDER BY OBOROT.[Юр.лицо],
          OBOROT.[Валюта]
      END
      SET @FIFONeedKol=@KrKol
      SET @FIFONeedKolSaved=@KrKol
      SET @FIFONeedKol2=@KrKol2
      SET @FIFOKol2All=0
      OPEN FIFOSaldoCurs4
      FETCH NEXT FROM FIFOSaldoCurs4 INTO
        @Valuta,
        @FIFOSaldoKol,
        @FIFOSaldoKol2,
        @FIFOSaldoSumma,
        @FIFOSaldoSummaRub,
        @FIFOSaldoSummaUSD
        SET @PartDbKol  = @DbKol -- переменные введены для обнуления дебетового кол-ва при работе по FIFO 24.05.2004
        SET @PartDbKol2 = @DbKol2
      WHILE @@FETCH_STATUS = 0 AND @FIFONeedKol>0
      BEGIN
        IF @FIFONeedKol<@FIFOSaldoKol  -- товара больше чем надо
        BEGIN
          SET @DocSpec=@SourceSpecID
          INSERT #ГенПроводка (
            [Вид],[Юр.лицо],[Дата],
            [Дебет],
            [Дб тип субконто 1],[Дб субконто 1],
            [Дб тип субконто 2],[Дб субконто 2],
            [Дб тип субконто 3],[Дб субконто 3],
            [Дб тип субконто 4],[Дб субконто 4],
            [Дб тип субконто 5],[Дб субконто 5],
            [Дб количество],
            [Дб количество 2],
            [Кредит],
            [Кр тип субконто 1],[Кр субконто 1],
            [Кр тип субконто 2],[Кр субконто 2],
            [Кр тип субконто 3],[Кр субконто 3],
            [Кр тип субконто 4],[Кр субконто 4],
            [Кр тип субконто 5],[Кр субконто 5],
            [Кр количество],
            [Кр количество 2],
            [Сумма],[Валюта],[Сумма руб.],[Курс руб.],[Сумма у.е.],[Курс у.е.],[Входит в сумму],Докспец,[Не формировать проводку])
          VALUES(
            @Vid,@Kontora,@Date,
            @Debet,
            @DbSubconto1Type,@DbSubconto1,
            @DbSubconto2Type,@DbSubconto2,
            @DbSubconto3Type,@DbSubconto3,
            @DbSubconto4Type,@DbSubconto4,
            @DbSubconto5Type,@DbSubconto5,
            @PartDbKol,
            @PartDbKol2,
            @Kredit,
            @KrSubconto1Type,@KrSubconto1,
            @KrSubconto2Type,@KrSubconto2,
            @KrSubconto3Type,@KrSubconto3,
            'Нет',0,
            'Нет',0,
            @FIFONeedKol,
                  @KrKol2,
            ROUND(@FIFONeedKol*(@FIFOSaldoSumma/(@FIFOSaldoKol+0.00000000)),2),
            @Valuta,
            0,
            @KursRub,
            0,
            @KursUSD,@InSumma,@DocSpec,@WithoutCreate)
          SET @FIFONeedKol=0
        END
      ELSE  -- товара меньше или равно чем надо - списывем все
      BEGIN
          SET @DocSpec=@SourceSpecID
          INSERT #ГенПроводка (
            [Вид],[Юр.лицо],[Дата],
            [Дебет],
            [Дб тип субконто 1],[Дб субконто 1],
            [Дб тип субконто 2],[Дб субконто 2],
            [Дб тип субконто 3],[Дб субконто 3],
            [Дб тип субконто 4],[Дб субконто 4],
            [Дб тип субконто 5],[Дб субконто 5],
            [Дб количество],
            [Дб количество 2],
            [Кредит],
            [Кр тип субконто 1],[Кр субконто 1],
            [Кр тип субконто 2],[Кр субконто 2],
            [Кр тип субконто 3],[Кр субконто 3],
            [Кр тип субконто 4],[Кр субконто 4],
            [Кр тип субконто 5],[Кр субконто 5],
            [Кр количество],
            [Кр количество 2],
            [Сумма],[Валюта],[Сумма руб.],[Курс руб.],[Сумма у.е.],[Курс у.е.],[Входит в сумму],Докспец,[Не формировать проводку])
          VALUES(
            @Vid,@Kontora,@Date,
            @Debet,
            @DbSubconto1Type,@DbSubconto1,
            @DbSubconto2Type,@DbSubconto2,
            @DbSubconto3Type,@DbSubconto3,
            @DbSubconto4Type,@DbSubconto4,
            @DbSubconto5Type,@DbSubconto5,
            @PartDbKol,
            @PartDbKol2,
            @Kredit,
            @KrSubconto1Type,@KrSubconto1,
            @KrSubconto2Type,@KrSubconto2,
            @KrSubconto3Type,@KrSubconto3,
            'Нет',0,
            'Нет',0,
            @FIFOSaldoKol,
                  @KrKol2,
            @FIFOSaldoSumma,
            @Valuta,
            @SummaRub,
            @KursRub,
            @SummaUSD,
            @KursUSD,@InSumma,@DocSpec,@WithoutCreate)
          SET @FIFONeedKol=@FIFONeedKol-@FIFOSaldoKol
        END
        FETCH NEXT FROM FIFOSaldoCurs4 INTO
        @Valuta,
          @FIFOSaldoKol,
          @FIFOSaldoKol2,
          @FIFOSaldoSumma,
          @FIFOSaldoSummaRub,
          @FIFOSaldoSummaUSD
         SET @PartDbKol  = 0
         SET @PartDbKol2 = 0
      END
      CLOSE FIFOSaldoCurs4
      DEALLOCATE FIFOSaldoCurs4

      -- партии кончились - смотрим сколько не хватило
      IF @FIFONeedKol>0
      BEGIN
        IF @WithoutCreate=0 and @FIFOErrorMode=0
        BEGIN
          SET @ErrorCount=@ErrorCount+1
          IF @UseTempSaldo=1
            UPDATE #Errors SET Count=Count+1
        END
      If @FIFOErrorMode=0 SET @FIFOErrorMsg  = 'Ошибка FIFO' 
      If @FIFOErrorMode=1 SET @FIFOErrorMsg  = 'Предупреждение FIFO' 
        SET @ValutaStr=Isnull((Select Название From Валюта With(Nolock) Where Номер=@Valuta),'') 
          SET @DocSpec=@SourceSpecID
        INSERT #ГенПроводка (
            [Вид],[Юр.лицо],[Дата],
            [Дебет],
            [Дб тип субконто 1],[Дб субконто 1],
            [Дб тип субконто 2],[Дб субконто 2],
            [Дб тип субконто 3],[Дб субконто 3],
            [Дб тип субконто 4],[Дб субконто 4],
            [Дб тип субконто 5],[Дб субконто 5],
            [Дб количество],
            [Дб количество 2],
            [Кредит],
            [Кр тип субконто 1],[Кр субконто 1],
            [Кр тип субконто 2],[Кр субконто 2],
            [Кр тип субконто 3],[Кр субконто 3],
            [Кр тип субконто 4],[Кр субконто 4],
            [Кр тип субконто 5],[Кр субконто 5],
            [Кр количество],
            [Кр количество 2],
            [Сумма],[Валюта],[Сумма руб.],[Курс руб.],[Сумма у.е.],[Курс у.е.],[Входит в сумму],
            [Ошибки генерации],[Примечание],Докспец,[Не формировать проводку])
          VALUES(
            @Vid,@Kontora,@Date,
            @Debet,
            @DbSubconto1Type,@DbSubconto1,
            @DbSubconto2Type,@DbSubconto2,
            @DbSubconto3Type,@DbSubconto3,
            @DbSubconto4Type,@DbSubconto4,
            @DbSubconto5Type,@DbSubconto5,
            @PartDbKol,
            @PartDbKol2,
            @Kredit,
            @KrSubconto1Type,@KrSubconto1,
            @KrSubconto2Type,@KrSubconto2,
            @KrSubconto3Type,@KrSubconto3,
            'Нет',0,
            'Нет',0,
            @FIFONeedKol,
                  @KrKol2,
            0,
            @Valuta,
            @SummaRub,@KursRub,
            @SummaUSD,@KursUSD,
                  @InSumma, (Case @WithoutCreate When 0 Then 1 Else 0 End),
     @FIFOErrorMsg+' - не хватило '+Convert(Varchar,@FIFONeedKol),
      @DocSpec,(Case @FIFOErrorMode When 2 Then 1 Else @WithoutCreate End))
      END
      END
      END -- контуры кончаются
    END
    FETCH NEXT FROM SourceSpecCurs210 INTO @SourceSpecID,@SourceSpecVid
  END

  CLOSE SourceSpecCurs210
  DEALLOCATE SourceSpecCurs210

  INSERT Проводка WITH(ROWLOCK) (
    [Документ],[Вид],[Дата],[Юр.лицо],
    [Дебет],
    [Дб тип субконто 1], [Дб субконто 1],
    [Дб тип субконто 2], [Дб субконто 2],
    [Дб тип субконто 3], [Дб субконто 3],
    [Дб тип субконто 4], [Дб субконто 4],
    [Дб тип субконто 5], [Дб субконто 5],
    [Дб количество],
    [Дб количество 2],
    [Кредит],
    [Кр тип субконто 1],[Кр субконто 1],
    [Кр тип субконто 2],[Кр субконто 2],
    [Кр тип субконто 3],[Кр субконто 3],
    [Кр тип субконто 4],[Кр субконто 4],
    [Кр тип субконто 5],[Кр субконто 5],
    [Кр количество],
    [Кр количество 2],
    [Сумма],[Валюта],[Сумма руб.],[Курс руб.],[Сумма у.е.],[Курс у.е.],[Входит в сумму],[ГенТип],
    [Примечание],[Ошибки генерации], [Зарплата],Докспец)

  SELECT
    @DocID,(case [Не формировать проводку] when 1 then -1*[Вид] else [Вид] end),[Дата],[Юр.лицо],
    [Дебет],
    [Дб тип субконто 1],[Дб субконто 1],
    [Дб тип субконто 2],[Дб субконто 2],
    [Дб тип субконто 3],[Дб субконто 3],
    [Дб тип субконто 4],[Дб субконто 4],
    [Дб тип субконто 5],[Дб субконто 5],
    SUM([Дб количество]),
    SUM([Дб количество 2]),
    [Кредит],
    [Кр тип субконто 1],[Кр субконто 1],
    [Кр тип субконто 2],[Кр субконто 2],
    [Кр тип субконто 3],[Кр субконто 3],
    [Кр тип субконто 4],[Кр субконто 4],
    [Кр тип субконто 5],[Кр субконто 5],
    SUM([Кр количество]),
    SUM([Кр количество 2]),
    SUM(ROUND([Сумма],2)),[Валюта],
    CASE [Валюта] WHEN dbo.[Код рубля]() THEN SUM(ROUND([Сумма],2)) ELSE SUM(ROUND([Сумма руб.],2)) END,
    [Курс руб.],
    CASE [Валюта] WHEN dbo.[Код у.е.]() THEN SUM(ROUND([Сумма],2)) ELSE SUM(ROUND([Сумма у.е.],2)) END,
    [Курс у.е.],[Входит в сумму],1,
    CASE
      WHEN ((SELECT TOP 1 [Контроль баланса] FROM [Вид проводки] WITH(NOLOCK) 
      WHERE Ключ = #ГенПроводка.Вид) = 1) AND (Дебет = '') AND (Кредит <> '') THEN SUBSTRING(dbo.ДобавитьПереносЕслиНеПусто ([Примечание]) + 'Кредит проводки есть, а дебет пуст', 1, 100)
      WHEN ((SELECT TOP 1 [Контроль баланса] FROM [Вид проводки] WITH(NOLOCK) 
      WHERE Ключ = #ГенПроводка.Вид) = 1) AND (Дебет <> '') AND (Кредит = '') THEN SUBSTRING(dbo.ДобавитьПереносЕслиНеПусто ([Примечание]) + 'Дебет проводки есть, а кредит пуст', 1, 100)
      WHEN ((SELECT TOP 1 [Контроль баланса] FROM [Вид проводки] WITH(NOLOCK) WHERE Ключ = #ГенПроводка.Вид) = 1) 
           AND ((SELECT TOP 1 [Контур учета] FROM Счет WITH(NOLOCK) WHERE Номер = Дебет) <> (SELECT TOP 1 [Контур учета] FROM Счет WITH(NOLOCK) WHERE Номер = Кредит))
           THEN SUBSTRING(dbo.ДобавитьПереносЕслиНеПусто ([Примечание]) + 'Дебет и Кредит относятся к различным контурам учета', 1, 100)
      ELSE [Примечание]
    END,
    CASE
      WHEN ((SELECT TOP 1 [Контроль баланса] FROM [Вид проводки] WITH(NOLOCK) WHERE Ключ = #ГенПроводка.Вид) = 1) AND (Дебет = '') AND (Кредит <> '') THEN SUM([Ошибки генерации]) + 1
      WHEN ((SELECT TOP 1 [Контроль баланса] FROM [Вид проводки] WITH(NOLOCK) WHERE Ключ = #ГенПроводка.Вид) = 1) AND (Дебет <> '') AND (Кредит = '') THEN SUM([Ошибки генерации]) + 1
      WHEN ((SELECT TOP 1 [Контроль баланса] FROM [Вид проводки] WITH(NOLOCK) WHERE Ключ = #ГенПроводка.Вид) = 1) 
      AND ((SELECT TOP 1 [Контур учета] FROM Счет WITH(NOLOCK) WHERE Номер = Дебет) <> (SELECT TOP 1 [Контур учета] FROM Счет WITH(NOLOCK) WHERE Номер = Кредит))
           THEN SUM([Ошибки генерации]) + 1
      ELSE SUM([Ошибки генерации])
    END,
    [Зарплата], Докспец
  FROM #ГенПроводка
  GROUP BY
    [Вид],[Дата],[Юр.лицо],
    [Дебет],
    [Дб тип субконто 1],[Дб субконто 1],
    [Дб тип субконто 2],[Дб субконто 2],
    [Дб тип субконто 3],[Дб субконто 3],
    [Дб тип субконто 4],[Дб субконто 4],
    [Дб тип субконто 5],[Дб субконто 5],
    [Кредит],
    [Кр тип субконто 1],[Кр субконто 1],
    [Кр тип субконто 2],[Кр субконто 2],
    [Кр тип субконто 3],[Кр субконто 3],
    [Кр тип субконто 4],[Кр субконто 4],
    [Кр тип субконто 5],[Кр субконто 5],
    [Валюта],[Курс руб.],[Курс у.е.],[Входит в сумму],[Примечание], [Зарплата],Докспец,[Не формировать проводку]
   HAVING       
     SUM([Дб количество])<>0 OR
     SUM([Дб количество 2])<>0 OR
     SUM([Кр количество])<>0 OR
     SUM([Кр количество 2])<>0 OR
     SUM(ROUND([Сумма],2))<>0 OR
     SUM(ROUND([Сумма руб.],2))<>0 OR
     SUM(ROUND([Сумма у.е.],2))<>0

    SELECT
      @ErrorCount = @ErrorCount +
      CASE
        WHEN ((SELECT TOP 1 [Контроль баланса] FROM [Вид проводки] WITH(NOLOCK) WHERE Ключ = #ГенПроводка.Вид) = 1) AND (Дебет = '') AND (Кредит <> '') THEN 1
        WHEN ((SELECT TOP 1 [Контроль баланса] FROM [Вид проводки] WITH(NOLOCK) WHERE Ключ = #ГенПроводка.Вид) = 1) AND (Дебет <> '') AND (Кредит = '') THEN 1
        WHEN ((SELECT TOP 1 [Контроль баланса] FROM [Вид проводки] WITH(NOLOCK) WHERE Ключ = #ГенПроводка.Вид) = 1) 
              AND ((SELECT TOP 1 [Контур учета] FROM Счет WITH(NOLOCK) WHERE Номер = Дебет) <> (SELECT TOP 1 [Контур учета] FROM Счет WITH(NOLOCK) WHERE Номер = Кредит)) THEN 1
        ELSE 0
      END
      FROM #ГенПроводка

  TRUNCATE TABLE #ГенПроводка

  DELETE Проводка WITH(ROWLOCK) WHERE Документ = @DocID and Вид < 0 
  UPDATE [Документ] WITH(ROWLOCK) SET [Ошибки генерации]=@ErrorCount,[Дата генерации]=GetDate() WHERE [Ключ]=@DocID
  EXECUTE [Заполнение суммы документа] @DocID,2
COMMIT
/************** SQL-after: конец  **************/
